package com.atomix.cafeteria.repository;

import com.atomix.cafeteria.entity.Payment;
import com.atomix.cafeteria.entity.PaymentStatus;
import com.atomix.cafeteria.entity.PaymentType;
import com.atomix.cafeteria.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    // Find by payment ID
    Optional<Payment> findByPaymentId(String paymentId);
    
    // Find by gateway payment ID
    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);
    
    // Find by gateway order ID
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    
    // Find payments by user
    Page<Payment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Find payments by user and payment type
    Page<Payment> findByUserAndPaymentTypeOrderByCreatedAtDesc(User user, PaymentType paymentType, Pageable pageable);
    
    // Find payments by user and status
    Page<Payment> findByUserAndPaymentStatusOrderByCreatedAtDesc(User user, PaymentStatus paymentStatus, Pageable pageable);
    
    // Find successful payments by user
    List<Payment> findByUserAndPaymentStatusOrderByCreatedAtDesc(User user, PaymentStatus paymentStatus);
    
    // Find payments by date range
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Payment> findByUserAndDateRange(@Param("user") User user, 
                                       @Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Find pending payments older than specified time
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = :status AND p.createdAt < :dateTime")
    List<Payment> findPendingPaymentsOlderThan(@Param("status") PaymentStatus status, 
                                              @Param("dateTime") LocalDateTime dateTime);
    
    // Get total successful payment amount by user
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.user = :user AND p.paymentStatus = :status")
    BigDecimal getTotalSuccessfulPaymentAmount(@Param("user") User user, @Param("status") PaymentStatus status);
    
    // Get total successful food card top-ups by user
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.user = :user AND p.paymentType = :paymentType AND p.paymentStatus = :status")
    BigDecimal getTotalFoodCardTopups(@Param("user") User user, 
                                    @Param("paymentType") PaymentType paymentType, 
                                    @Param("status") PaymentStatus status);
    
    // Count payments by status
    long countByPaymentStatus(PaymentStatus paymentStatus);
    
    // Count payments by payment type
    long countByPaymentType(PaymentType paymentType);
    
    // Get payment statistics
    @Query("SELECT p.paymentStatus, COUNT(p), COALESCE(SUM(p.amount), 0) FROM Payment p GROUP BY p.paymentStatus")
    List<Object[]> getPaymentStatistics();
    
    // Get daily payment summary
    @Query("SELECT DATE(p.createdAt), COUNT(p), COALESCE(SUM(p.amount), 0) FROM Payment p " +
           "WHERE p.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(p.createdAt) ORDER BY DATE(p.createdAt)")
    List<Object[]> getDailyPaymentSummary(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    // Find payments that need refund processing
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = :status AND p.refundAmount > 0")
    List<Payment> findPaymentsRequiringRefund(@Param("status") PaymentStatus status);
} 