package com.finwise.backend.order;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    public record CheckoutLine(
            @NotBlank String title,
            @NotNull @DecimalMin("0") BigDecimal price,
            @DecimalMin("0") BigDecimal originalPrice) {}

    public record CheckoutRequest(
            @NotEmpty List<@Valid CheckoutLine> items,
            @NotBlank String paymentMethod) {}

    private final OrderRepository orderRepository;
    private final CurrentUserService currentUserService;

    public OrderController(OrderRepository orderRepository, CurrentUserService currentUserService) {
        this.orderRepository = orderRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(Authentication auth) {
        User user = currentUserService.require(auth);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id, Authentication auth) {
        Order order = orderRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Order"));
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), order.getUser());
        return order;
    }

    /**
     * Places an order for the services in the cart. Payment is simulated (demo mode):
     * the order is recorded as paid and completed.
     */
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody CheckoutRequest request, Authentication auth) {
        User user = currentUserService.require(auth);

        BigDecimal finalAmount = request.items().stream()
                .map(CheckoutLine::price)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAmount = request.items().stream()
                .map(line -> line.originalPrice() != null && line.originalPrice().compareTo(line.price()) > 0
                        ? line.originalPrice() : line.price())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(totalAmount.subtract(finalAmount));
        order.setFinalAmount(finalAmount);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setOrderStatus(Order.OrderStatus.COMPLETED);
        order.setPaymentTransactionId("DEMO-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        order.setNotes(request.items().stream().map(CheckoutLine::title).collect(Collectors.joining(", ")));
        return ResponseEntity.status(HttpStatus.CREATED).body(orderRepository.save(order));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Order"));
        order.setOrderStatus(status);
        if (status == Order.OrderStatus.REFUNDED) {
            order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        }
        return orderRepository.save(order);
    }
}
