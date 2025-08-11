package com.finwise.backend.message;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Message>> getMyMessages(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Message> messages = messageRepository.findByToUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/sent-messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Message>> getSentMessages(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Message> messages = messageRepository.findByFromUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @messageRepository.findById(#id).orElse(null)?.toUser?.email == principal.name or @messageRepository.findById(#id).orElse(null)?.fromUser?.email == principal.name")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        return messageRepository.findById(id)
                .map(message -> ResponseEntity.ok().body(message))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Message> sendMessage(@Valid @RequestBody Message message, Principal principal) {
        User fromUser = userRepository.findByEmail(principal.getName()).orElse(null);
        if (fromUser == null) {
            return ResponseEntity.badRequest().build();
        }
        message.setFromUser(fromUser);
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Message> markAsRead(@PathVariable Long id, Principal principal) {
        return messageRepository.findById(id)
                .map(message -> {
                    if (message.getToUser().getEmail().equals(principal.getName())) {
                        message.setIsRead(true);
                        return ResponseEntity.ok(messageRepository.save(message));
                    }
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).<Message>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @messageRepository.findById(#id).orElse(null)?.fromUser?.email == principal.name")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        return messageRepository.findById(id)
                .map(message -> {
                    messageRepository.delete(message);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        return ResponseEntity.ok(messages);
    }
}
