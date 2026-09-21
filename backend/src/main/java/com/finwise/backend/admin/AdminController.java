package com.finwise.backend.admin;

import com.finwise.backend.appointment.Appointment;
import com.finwise.backend.appointment.AppointmentRepository;
import com.finwise.backend.document.Document;
import com.finwise.backend.document.DocumentRepository;
import com.finwise.backend.message.MessageRepository;
import com.finwise.backend.order.Order;
import com.finwise.backend.order.OrderRepository;
import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.CreateUserRequest;
import com.finwise.backend.user.Role;
import com.finwise.backend.user.UpdateUserRequest;
import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final AppointmentRepository appointmentRepository;
    private final MessageRepository messageRepository;
    private final DocumentRepository documentRepository;
    private final AdminUserService adminUserService;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, OrderRepository orderRepository,
                           AppointmentRepository appointmentRepository, MessageRepository messageRepository,
                           DocumentRepository documentRepository, AdminUserService adminUserService,
                           CurrentUserService currentUserService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.appointmentRepository = appointmentRepository;
        this.messageRepository = messageRepository;
        this.documentRepository = documentRepository;
        this.adminUserService = adminUserService;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats(Authentication auth) {
        User admin = currentUserService.require(auth);
        long totalUsers = userRepository.count();
        long admins = userRepository.countByRole(Role.ADMIN);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("users", Map.of("total", totalUsers, "admins", admins, "regular", totalUsers - admins));
        stats.put("orders", Map.of(
                "total", orderRepository.count(),
                "completed", orderRepository.countByOrderStatus(Order.OrderStatus.COMPLETED),
                "revenue", orderRepository.sumFinalAmountByPaymentStatus(Order.PaymentStatus.PAID)));
        stats.put("appointments", Map.of(
                "total", appointmentRepository.count(),
                "pending", appointmentRepository.countByStatus(Appointment.AppointmentStatus.PENDING)));
        stats.put("documents", Map.of(
                "total", documentRepository.count(),
                "pending", documentRepository.countByStatus(Document.DocumentStatus.PENDING)));
        stats.put("messages", Map.of(
                "total", messageRepository.count(),
                "unread", messageRepository.countByToUserIdAndIsReadFalse(admin.getId())));
        return stats;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("User"));
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
        }
        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request, Authentication auth) {
        User current = currentUserService.require(auth);
        User user = userRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("User"));

        String email = request.getEmail().trim().toLowerCase();
        if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
        }
        Role newRole = request.getRole() != null ? request.getRole() : user.getRole();
        guardSelfDemotion(current, user, newRole);

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setRole(newRole);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 8) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestParam Role role, Authentication auth) {
        User current = currentUserService.require(auth);
        User user = userRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("User"));
        guardSelfDemotion(current, user, role);
        user.setRole(role);
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication auth) {
        User current = currentUserService.require(auth);
        if (current.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }
        adminUserService.deleteUserAndData(id);
        return ResponseEntity.noContent().build();
    }

    private static void guardSelfDemotion(User current, User target, Role newRole) {
        if (current.getId().equals(target.getId()) && newRole != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot remove your own admin role");
        }
    }
}
