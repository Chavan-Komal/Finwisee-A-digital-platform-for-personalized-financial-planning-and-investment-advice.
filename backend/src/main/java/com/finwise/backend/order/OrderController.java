package com.finwise.backend.order;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> ResponseEntity.ok().body(order))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order-number/{orderNumber}")
    @PreAuthorize("hasRole('ADMIN') or @orderRepository.findByOrderNumber(#orderNumber).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(order -> ResponseEntity.ok().body(order))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        order.setUser(user);
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @Valid @RequestBody Order orderDetails) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setOrderStatus(orderDetails.getOrderStatus());
                    order.setPaymentStatus(orderDetails.getPaymentStatus());
                    order.setPaymentMethod(orderDetails.getPaymentMethod());
                    order.setPaymentTransactionId(orderDetails.getPaymentTransactionId());
                    order.setNotes(orderDetails.getNotes());
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setOrderStatus(status);
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return ResponseEntity.ok(orders);
    }
}
