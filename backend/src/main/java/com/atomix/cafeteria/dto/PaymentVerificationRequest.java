package com.atomix.cafeteria.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerificationRequest {
    
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    
    @NotBlank(message = "Gateway payment ID is required")
    private String gatewayPaymentId;
    
    @NotBlank(message = "Gateway order ID is required")
    private String gatewayOrderId;
    
    private String gatewaySignature; // For Razorpay signature verification
    
    // Constructors
    public PaymentVerificationRequest() {}
    
    public PaymentVerificationRequest(String paymentId, String gatewayPaymentId, String gatewayOrderId) {
        this.paymentId = paymentId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.gatewayOrderId = gatewayOrderId;
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
    
    public String getGatewaySignature() {
        return gatewaySignature;
    }
    
    public void setGatewaySignature(String gatewaySignature) {
        this.gatewaySignature = gatewaySignature;
    }
} 