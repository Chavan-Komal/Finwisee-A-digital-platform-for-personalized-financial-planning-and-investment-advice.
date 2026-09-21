package com.finwise.backend.document;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final CurrentUserService currentUserService;
    private final Path uploadRoot;

    public DocumentController(DocumentRepository documentRepository,
                              CurrentUserService currentUserService,
                              @Value("${app.upload-dir}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.currentUserService = currentUserService;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @GetMapping("/my-documents")
    public List<Document> getMyDocuments(Authentication auth) {
        User user = currentUserService.require(auth);
        return documentRepository.findByUserIdOrderByUploadDateDesc(user.getId());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Document> getAllDocuments() {
        return documentRepository.findAllByOrderByUploadDateDesc();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Document> uploadDocument(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        User user = currentUserService.require(auth);
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please choose a non-empty file");
        }
        String originalName = sanitizeFileName(file.getOriginalFilename());
        Path userDir = uploadRoot.resolve(String.valueOf(user.getId()));
        Files.createDirectories(userDir);
        Path target = userDir.resolve(UUID.randomUUID() + "_" + originalName).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
        }
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        Document document = new Document(user, originalName, file.getSize(),
                file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE);
        document.setFilePath(uploadRoot.relativize(target).toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(documentRepository.save(document));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id, Authentication auth) {
        Document document = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), document.getUser());
        Path path = resolveStoredFile(document);
        if (path == null || !Files.exists(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The file for this document is no longer available");
        }
        MediaType type;
        try {
            type = MediaType.parseMediaType(document.getFileType());
        } catch (Exception e) {
            type = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .contentType(type)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(document.getFileName(), StandardCharsets.UTF_8).build().toString())
                .body(new PathResource(path));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Document updateDocumentStatus(@PathVariable Long id,
                                         @RequestParam Document.DocumentStatus status,
                                         @RequestParam(required = false) String reviewNotes) {
        Document document = find(id);
        document.setStatus(status);
        document.setReviewDate(LocalDateTime.now());
        if (reviewNotes != null) {
            document.setReviewNotes(reviewNotes);
        }
        return documentRepository.save(document);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Authentication auth) throws IOException {
        Document document = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), document.getUser());
        Path path = resolveStoredFile(document);
        if (path != null) {
            Files.deleteIfExists(path);
        }
        documentRepository.delete(document);
        return ResponseEntity.noContent().build();
    }

    private Document find(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Document"));
    }

    private Path resolveStoredFile(Document document) {
        if (document.getFilePath() == null) return null;
        Path path = uploadRoot.resolve(document.getFilePath()).normalize();
        return path.startsWith(uploadRoot) ? path : null;
    }

    private static String sanitizeFileName(String name) {
        String base = name == null ? "document" : Path.of(name).getFileName().toString();
        base = base.replaceAll("[^A-Za-z0-9._ -]", "_").trim();
        if (base.isEmpty() || base.equals(".") || base.equals("..")) base = "document";
        return base.length() > 150 ? base.substring(base.length() - 150) : base;
    }
}
