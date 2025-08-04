package com.atomix.cafeteria.entity;

public enum VendorStatus {
    PENDING("Pending Approval"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    SUSPENDED("Suspended"),
    INACTIVE("Inactive");
    
    private final String displayName;
    
    VendorStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isActive() {
        return this == APPROVED;
    }
    
    public boolean canOperate() {
        return this == APPROVED;
    }
} 