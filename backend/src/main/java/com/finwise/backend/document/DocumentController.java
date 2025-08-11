package com.finwise.backend.document;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-documents")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getMyDocuments(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Document> documents = documentRepository.findByUserIdOrderByUploadDateDesc(user.getId());
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @documentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(document -> ResponseEntity.ok().body(document))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Document> uploadDocument(@Valid @RequestBody Document document, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        document.setUser(user);
        Document savedDocument = documentRepository.save(document);
        return ResponseEntity.ok(savedDocument);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @documentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @Valid @RequestBody Document documentDetails) {
        return documentRepository.findById(id)
                .map(document -> {
                    document.setFileName(documentDetails.getFileName());
                    document.setFileSize(documentDetails.getFileSize());
                    document.setFileType(documentDetails.getFileType());
                    document.setFilePath(documentDetails.getFilePath());
                    return ResponseEntity.ok(documentRepository.save(document));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @documentRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(document -> {
                    documentRepository.delete(document);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Document> updateDocumentStatus(@PathVariable Long id, @RequestParam Document.DocumentStatus status, @RequestParam(required = false) String reviewNotes) {
        return documentRepository.findById(id)
                .map(document -> {
                    document.setStatus(status);
                    if (reviewNotes != null) {
                        document.setReviewNotes(reviewNotes);
                    }
                    return ResponseEntity.ok(documentRepository.save(document));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentRepository.findAll();
        return ResponseEntity.ok(documents);
    }
}
