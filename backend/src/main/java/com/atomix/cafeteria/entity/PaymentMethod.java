package com.atomix.cafeteria.entity;

public enum PaymentMethod {
    FOOD_CARD("Food Card"),
    CREDIT_CARD("Credit Card"),
    DEBIT_CARD("Debit Card"),
    UPI("UPI Payment"),
    NET_BANKING("Net Banking"),
    WALLET("Digital Wallet"),
    CASH("Cash Payment"),
    RAZORPAY("Razorpay"),
    STRIPE("Stripe");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isDigital() {
        return this != CASH;
    }
    
    public boolean requiresGateway() {
        return this == CREDIT_CARD || this == DEBIT_CARD || 
               this == UPI || this == NET_BANKING || 
               this == RAZORPAY || this == STRIPE;
    }
    
    public boolean isInternalPayment() {
        return this == FOOD_CARD;
    }
} 