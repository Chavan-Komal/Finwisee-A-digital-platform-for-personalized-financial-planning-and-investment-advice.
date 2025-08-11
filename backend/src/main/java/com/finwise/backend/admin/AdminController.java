package com.finwise.backend.admin;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import com.finwise.backend.order.Order;
import com.finwise.backend.order.OrderRepository;
import com.finwise.backend.course.Course;
import com.finwise.backend.course.CourseRepository;
import com.finwise.backend.category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.finwise.backend.user.CreateUserRequest;
import com.finwise.backend.user.UpdateUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole(com.finwise.backend.user.Role.ADMIN);
        long regularUsers = totalUsers - adminUsers;
        
        // Order statistics
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByOrderStatus(Order.OrderStatus.PENDING);
        long completedOrders = orderRepository.countByOrderStatus(Order.OrderStatus.COMPLETED);
        
        // Course statistics
        long totalCourses = courseRepository.count();
        long publishedCourses = courseRepository.findByIsPublishedTrue().size();
        
        // Category statistics
        long totalCategories = categoryRepository.count();
        long activeCategories = categoryRepository.findByIsActiveTrue().size();
        
        stats.put("users", Map.of(
            "total", totalUsers,
            "admins", adminUsers,
            "regular", regularUsers
        ));
        
        stats.put("orders", Map.of(
            "total", totalOrders,
            "pending", pendingOrders,
            "completed", completedOrders
        ));
        
        stats.put("courses", Map.of(
            "total", totalCourses,
            "published", publishedCourses
        ));
        
        stats.put("categories", Map.of(
            "total", totalCategories,
            "active", activeCategories
        ));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam com.finwise.backend.user.Role role) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(role);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // New endpoint to create a new user
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        
        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole());
        
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(201).body(savedUser);
    }

    // New endpoint to update user details (not just role)
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setEmail(request.getEmail());
                    user.setPhone(request.getPhone());
                    user.setRole(request.getRole());
                    
                    // Only update password if provided
                    if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                    }
                    
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<List<Order>> getRecentOrders(@RequestParam(defaultValue = "10") int limit) {
        List<Order> orders = orderRepository.findAll();
        // Limit the results
        if (orders.size() > limit) {
            orders = orders.subList(0, limit);
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/courses/unpublished")
    public ResponseEntity<List<Course>> getUnpublishedCourses() {
        List<Course> courses = courseRepository.findAll();
        List<Course> unpublishedCourses = courses.stream()
                .filter(course -> !course.getIsPublished())
                .toList();
        return ResponseEntity.ok(unpublishedCourses);
    }

    @PutMapping("/courses/{id}/publish")
    public ResponseEntity<Course> publishCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setIsPublished(true);
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/courses/{id}/unpublish")
    public ResponseEntity<Course> unpublishCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setIsPublished(false);
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
