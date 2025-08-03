package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.PaymentMethod;
import com.atomix.cafeteria.entity.PaymentStatus;
import com.atomix.cafeteria.entity.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    
    private String paymentId;
    private String gatewayPaymentId;
    private String gatewayOrderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private PaymentType paymentType;
    private String currency;
    private String description;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    
    // Gateway specific fields for frontend integration
    private String razorpayKeyId; // For Razorpay frontend
    private String stripePublicKey; // For Stripe frontend
    private String clientSecret; // For Stripe
    
    // Constructors
    public PaymentResponse() {}
    
    public PaymentResponse(String paymentId, String gatewayPaymentId, BigDecimal amount, 
                          PaymentMethod paymentMethod, PaymentStatus paymentStatus) {
        this.paymentId = paymentId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }
    
    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
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
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }
    
    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }
    
    public String getStripePublicKey() {
        return stripePublicKey;
    }
    
    public void setStripePublicKey(String stripePublicKey) {
        this.stripePublicKey = stripePublicKey;
    }
    
    public String getClientSecret() {
        return clientSecret;
    }
    
    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }
} 