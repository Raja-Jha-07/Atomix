package com.atomix.cafeteria.repository;

import com.atomix.cafeteria.entity.Payment;
import com.atomix.cafeteria.entity.PaymentType;
import com.atomix.cafeteria.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    
    List<Payment> findByUserAndTypeOrderByCreatedAtDesc(User user, PaymentType type);
    
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.createdAt >= :startDate ORDER BY p.createdAt DESC")
    List<Payment> findRecentPaymentsByUser(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED'")
    Long countCompletedPaymentsByUser(@Param("user") User user);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED' AND p.type = :type")
    BigDecimal getTotalAmountByUserAndType(@Param("user") User user, @Param("type") PaymentType type);
} 