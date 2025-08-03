package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.PaymentMethod;
import com.atomix.cafeteria.entity.PaymentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class PaymentRequest {
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;
    
    private Long orderId; // Optional, required only for order payments
    
    private String description;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(BigDecimal amount, PaymentMethod paymentMethod, PaymentType paymentType) {
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentType = paymentType;
    }
    
    // Getters and Setters
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
    
    public PaymentType getPaymentType() {
        return paymentType;
    }
    
    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
} 