package com.atomix.cafeteria.entity;

public enum VendorType {
    PERMANENT("Permanent Vendor"),
    TEMPORARY("Temporary Food Stall"),
    SEASONAL("Seasonal Vendor"),
    EVENT_BASED("Event-Based Vendor");
    
    private final String displayName;
    
    VendorType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isTemporary() {
        return this == TEMPORARY || this == SEASONAL || this == EVENT_BASED;
    }
    
    public boolean requiresDateRange() {
        return isTemporary();
    }
} 