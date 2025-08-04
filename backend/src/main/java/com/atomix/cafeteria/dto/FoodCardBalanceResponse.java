package com.atomix.cafeteria.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FoodCardBalanceResponse {
    
    private Long userId;
    private BigDecimal balance;
    private LocalDateTime lastUpdated;
    
    // Constructors
    public FoodCardBalanceResponse() {}
    
    public FoodCardBalanceResponse(Long userId, BigDecimal balance) {
        this.userId = userId;
        this.balance = balance;
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public BigDecimal getBalance() {
        return balance;
    }
    
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
} 