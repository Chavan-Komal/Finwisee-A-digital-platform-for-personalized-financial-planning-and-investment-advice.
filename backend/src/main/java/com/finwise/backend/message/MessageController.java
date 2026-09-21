package com.finwise.backend.message;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.Role;
import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    /** toUserId is optional for regular users: their messages go to the support/admin team. */
    public record SendMessageRequest(
            Long toUserId,
            @NotBlank @Size(max = 255) String subject,
            @NotBlank @Size(max = 5000) String message) {}

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository,
                             CurrentUserService currentUserService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/my-messages")
    public List<Message> getMyMessages(Authentication auth) {
        User user = currentUserService.require(auth);
        return messageRepository.findByToUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/sent-messages")
    public List<Message> getSentMessages(Authentication auth) {
        User user = currentUserService.require(auth);
        return messageRepository.findByFromUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        User user = currentUserService.require(auth);
        return Map.of("count", messageRepository.countByToUserIdAndIsReadFalse(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@Valid @RequestBody SendMessageRequest request, Authentication auth) {
        User from = currentUserService.require(auth);
        User to;
        if (request.toUserId() != null) {
            to = userRepository.findById(request.toUserId())
                    .orElseThrow(() -> CurrentUserService.notFound("Recipient"));
            if (!CurrentUserService.isAdmin(from) && to.getRole() != Role.ADMIN) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only message the Finwise advisors");
            }
        } else {
            to = userRepository.findByRole(Role.ADMIN).stream()
                    .filter(admin -> !admin.getId().equals(from.getId()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No recipient available"));
        }
        if (to.getId().equals(from.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a message to yourself");
        }
        Message message = new Message(from, to, request.subject().trim(), request.message().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(messageRepository.save(message));
    }

    @PutMapping("/{id}/read")
    public Message markAsRead(@PathVariable Long id, Authentication auth) {
        User user = currentUserService.require(auth);
        Message message = find(id);
        if (!message.getToUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the recipient can mark a message as read");
        }
        message.setIsRead(true);
        return messageRepository.save(message);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id, Authentication auth) {
        User user = currentUserService.require(auth);
        Message message = find(id);
        boolean participant = message.getFromUser().getId().equals(user.getId())
                || message.getToUser().getId().equals(user.getId());
        if (!participant && !CurrentUserService.isAdmin(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this message");
        }
        messageRepository.delete(message);
        return ResponseEntity.noContent().build();
    }

    private Message find(Long id) {
        return messageRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Message"));
    }
}
