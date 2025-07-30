package com.atomix.cafeteria.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @NotNull
    @PositiveOrZero
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @PositiveOrZero
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @PositiveOrZero
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Column(name = "payment_transaction_id")
    private String paymentTransactionId;
    
    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;
    
    @Column(name = "estimated_preparation_time")
    private Integer estimatedPreparationTime; // in minutes
    
    @Column(name = "actual_preparation_time")
    private Integer actualPreparationTime; // in minutes
    
    @Column(name = "order_confirmed_at")
    private LocalDateTime orderConfirmedAt;
    
    @Column(name = "preparation_started_at")
    private LocalDateTime preparationStartedAt;
    
    @Column(name = "ready_at")
    private LocalDateTime readyAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Column(name = "cancellation_reason")
    private String cancellationReason;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Order() {}
    
    public Order(String orderNumber, User user, Vendor vendor, BigDecimal totalAmount) {
        this.orderNumber = orderNumber;
        this.user = user;
        this.vendor = vendor;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Vendor getVendor() {
        return vendor;
    }
    
    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }
    
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }
    
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public LocalDateTime getPickupTime() {
        return pickupTime;
    }
    
    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }
    
    public void setPaymentTransactionId(String paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public Integer getEstimatedPreparationTime() {
        return estimatedPreparationTime;
    }
    
    public void setEstimatedPreparationTime(Integer estimatedPreparationTime) {
        this.estimatedPreparationTime = estimatedPreparationTime;
    }
    
    public Integer getActualPreparationTime() {
        return actualPreparationTime;
    }
    
    public void setActualPreparationTime(Integer actualPreparationTime) {
        this.actualPreparationTime = actualPreparationTime;
    }
    
    public LocalDateTime getOrderConfirmedAt() {
        return orderConfirmedAt;
    }
    
    public void setOrderConfirmedAt(LocalDateTime orderConfirmedAt) {
        this.orderConfirmedAt = orderConfirmedAt;
    }
    
    public LocalDateTime getPreparationStartedAt() {
        return preparationStartedAt;
    }
    
    public void setPreparationStartedAt(LocalDateTime preparationStartedAt) {
        this.preparationStartedAt = preparationStartedAt;
    }
    
    public LocalDateTime getReadyAt() {
        return readyAt;
    }
    
    public void setReadyAt(LocalDateTime readyAt) {
        this.readyAt = readyAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }
    
    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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
    
    // Helper methods
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
    
    public void removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }
    
    public BigDecimal calculateTotalAmount() {
        BigDecimal itemsTotal = orderItems.stream()
            .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return itemsTotal.add(taxAmount).subtract(discountAmount);
    }
    
    public int getTotalItems() {
        return orderItems.stream()
            .mapToInt(OrderItem::getQuantity)
            .sum();
    }
    
    public boolean canBeCancelled() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }
    
    public boolean isCompleted() {
        return status == OrderStatus.COMPLETED;
    }
    
    public boolean isPaid() {
        return paymentStatus == PaymentStatus.PAID;
    }
} 