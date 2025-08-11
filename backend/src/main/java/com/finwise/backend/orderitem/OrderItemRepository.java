package com.finwise.backend.orderitem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    
    List<OrderItem> findByCourseId(Long courseId);
    
    List<OrderItem> findByItemId(Long itemId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.id = :userId")
    List<OrderItem> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.course.id = :courseId AND oi.order.user.id = :userId")
    List<OrderItem> findByCourseIdAndUserId(@Param("courseId") Long courseId, @Param("userId") Long userId);
}
