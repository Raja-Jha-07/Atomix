package com.atomix.cafeteria.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerificationRequest {
    
    @NotBlank
    private String paymentId;
    
    @NotBlank
    private String orderId;
    
    @NotBlank
    private String signature;
    
    // Constructors
    public PaymentVerificationRequest() {}
    
    public PaymentVerificationRequest(String paymentId, String orderId, String signature) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.signature = signature;
    }
    
    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    
    public String getSignature() {
        return signature;
    }
    
    public void setSignature(String signature) {
        this.signature = signature;
    }
} 