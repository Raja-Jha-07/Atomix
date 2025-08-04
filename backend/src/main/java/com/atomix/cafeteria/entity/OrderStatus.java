package com.atomix.cafeteria.entity;

public enum OrderStatus {
    PENDING("Order Pending"),
    CONFIRMED("Order Confirmed"),
    PREPARING("Being Prepared"),
    READY("Ready for Pickup"),
    COMPLETED("Order Completed"),
    CANCELLED("Order Cancelled"),
    REFUNDED("Order Refunded");
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isActive() {
        return this != CANCELLED && this != REFUNDED && this != COMPLETED;
    }
    
    public boolean canBeModified() {
        return this == PENDING;
    }
    
    public boolean canBeCancelled() {
        return this == PENDING || this == CONFIRMED;
    }
} 