package com.finwise.backend.item;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemController(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Item> list() {
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> get(@PathVariable Long id) {
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Item item, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        Long userId = (Long) authentication.getPrincipal();
        User creator = userRepository.findById(userId).orElse(null);
        if (creator == null) return ResponseEntity.status(401).build();
        if (item.getPrice() == null) item.setPrice(BigDecimal.ZERO);
        item.setCreatedBy(creator);
        Item saved = itemRepository.save(item);
        return ResponseEntity.created(URI.create("/api/items/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Item payload, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        Long userId = (Long) authentication.getPrincipal();
        return itemRepository.findById(id).map(existing -> {
            // Allow owner or admin; admin checked via role
            boolean isOwner = existing.getCreatedBy() != null && existing.getCreatedBy().getId().equals(userId);
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isOwner && !isAdmin) return ResponseEntity.status(403).build();
            existing.setName(payload.getName());
            existing.setDescription(payload.getDescription());
            existing.setPrice(payload.getPrice());
            itemRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        Long userId = (Long) authentication.getPrincipal();
        return itemRepository.findById(id).map(existing -> {
            boolean isOwner = existing.getCreatedBy() != null && existing.getCreatedBy().getId().equals(userId);
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isOwner && !isAdmin) return ResponseEntity.status(403).build();
            itemRepository.delete(existing);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
