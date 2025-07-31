package com.atomix.cafeteria.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "payment_id", unique = true, nullable = false)
    private String paymentId; // Internal payment ID
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // Null for food card top-ups
    
    @NotNull
    @PositiveOrZero
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType; // ORDER_PAYMENT or FOOD_CARD_TOPUP
    
    // Gateway specific fields
    @Column(name = "gateway_payment_id")
    private String gatewayPaymentId; // Razorpay payment_id or Stripe payment_intent_id
    
    @Column(name = "gateway_order_id")
    private String gatewayOrderId; // Razorpay order_id or Stripe client_secret
    
    @Column(name = "gateway_signature")
    private String gatewaySignature; // For payment verification
    
    @Column(name = "gateway_receipt")
    private String gatewayReceipt; // Receipt number from gateway
    
    @Column(name = "gateway_currency")
    private String gatewayCurrency = "INR";
    
    // Payment metadata
    @Column(name = "description")
    private String description;
    
    @Column(name = "failure_reason")
    private String failureReason;
    
    @Column(name = "refund_id")
    private String refundId; // For refund tracking
    
    @PositiveOrZero
    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;
    
    // Timestamps
    @Column(name = "gateway_created_at")
    private LocalDateTime gatewayCreatedAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "failed_at")
    private LocalDateTime failedAt;
    
    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Payment() {}
    
    public Payment(String paymentId, User user, BigDecimal amount, PaymentMethod paymentMethod, PaymentType paymentType) {
        this.paymentId = paymentId;
        this.user = user;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentType = paymentType;
        this.paymentStatus = PaymentStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public PaymentType getPaymentType() {
        return paymentType;
    }
    
    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }
    
    public String getGatewayPaymentId() {
        return gatewayPaymentId;
    }
    
    public void setGatewayPaymentId(String gatewayPaymentId) {
        this.gatewayPaymentId = gatewayPaymentId;
    }
    
    public String getGatewayOrderId() {
        return gatewayOrderId;
    }
    
    public void setGatewayOrderId(String gatewayOrderId) {
        this.gatewayOrderId = gatewayOrderId;
    }
    
    public String getGatewaySignature() {
        return gatewaySignature;
    }
    
    public void setGatewaySignature(String gatewaySignature) {
        this.gatewaySignature = gatewaySignature;
    }
    
    public String getGatewayReceipt() {
        return gatewayReceipt;
    }
    
    public void setGatewayReceipt(String gatewayReceipt) {
        this.gatewayReceipt = gatewayReceipt;
    }
    
    public String getGatewayCurrency() {
        return gatewayCurrency;
    }
    
    public void setGatewayCurrency(String gatewayCurrency) {
        this.gatewayCurrency = gatewayCurrency;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public String getRefundId() {
        return refundId;
    }
    
    public void setRefundId(String refundId) {
        this.refundId = refundId;
    }
    
    public BigDecimal getRefundAmount() {
        return refundAmount;
    }
    
    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }
    
    public LocalDateTime getGatewayCreatedAt() {
        return gatewayCreatedAt;
    }
    
    public void setGatewayCreatedAt(LocalDateTime gatewayCreatedAt) {
        this.gatewayCreatedAt = gatewayCreatedAt;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public LocalDateTime getFailedAt() {
        return failedAt;
    }
    
    public void setFailedAt(LocalDateTime failedAt) {
        this.failedAt = failedAt;
    }
    
    public LocalDateTime getRefundedAt() {
        return refundedAt;
    }
    
    public void setRefundedAt(LocalDateTime refundedAt) {
        this.refundedAt = refundedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Utility methods
    public boolean isSuccessful() {
        return paymentStatus == PaymentStatus.PAID;
    }
    
    public boolean isFailed() {
        return paymentStatus == PaymentStatus.FAILED;
    }
    
    public boolean isPending() {
        return paymentStatus == PaymentStatus.PENDING || paymentStatus == PaymentStatus.PROCESSING;
    }
    
    public boolean canBeRefunded() {
        return paymentStatus == PaymentStatus.PAID && refundAmount.compareTo(amount) < 0;
    }
    
    public boolean isFoodCardTopup() {
        return paymentType == PaymentType.FOOD_CARD_TOPUP;
    }
    
    public boolean isOrderPayment() {
        return paymentType == PaymentType.ORDER_PAYMENT;
    }
} 