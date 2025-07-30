package com.atomix.cafeteria.entity;

public enum PaymentStatus {
    PENDING("Payment Pending"),
    PROCESSING("Payment Processing"),
    PAID("Payment Successful"),
    FAILED("Payment Failed"),
    REFUNDED("Payment Refunded"),
    PARTIALLY_REFUNDED("Partially Refunded");
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isSuccessful() {
        return this == PAID;
    }
    
    public boolean isFinal() {
        return this == PAID || this == FAILED || this == REFUNDED;
    }
    
    public boolean canBeRefunded() {
        return this == PAID;
    }
} 