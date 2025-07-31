package com.atomix.cafeteria.entity;

public enum PaymentType {
    ORDER_PAYMENT("Order Payment"),
    FOOD_CARD_TOPUP("Food Card Top-up");
    
    private final String displayName;
    
    PaymentType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isOrderPayment() {
        return this == ORDER_PAYMENT;
    }
    
    public boolean isFoodCardTopup() {
        return this == FOOD_CARD_TOPUP;
    }
} 