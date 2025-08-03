package com.atomix.cafeteria.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PaymentRequest {
    
    @NotNull
    @Positive
    private Integer amount; // Amount in paise
    
    private String currency = "INR";
    private String description;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(Integer amount, String currency, String description) {
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }
    
    // Getters and Setters
    public Integer getAmount() {
        return amount;
    }
    
    public void setAmount(Integer amount) {
        this.amount = amount;
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
} 