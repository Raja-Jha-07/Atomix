package com.atomix.cafeteria.dto;

import java.time.LocalDateTime;

public class PaymentHealthResponse {
    
    private String razorpayStatus;
    private String stripeStatus;
    private LocalDateTime timestamp;
    private String message;
    
    // Constructors
    public PaymentHealthResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getRazorpayStatus() {
        return razorpayStatus;
    }
    
    public void setRazorpayStatus(String razorpayStatus) {
        this.razorpayStatus = razorpayStatus;
    }
    
    public String getStripeStatus() {
        return stripeStatus;
    }
    
    public void setStripeStatus(String stripeStatus) {
        this.stripeStatus = stripeStatus;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
} 