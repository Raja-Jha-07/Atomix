package com.atomix.cafeteria.entity;

public enum UserRole {
    EMPLOYEE("Employee"),
    VENDOR("Vendor"),
    ADMIN("Administrator"),
    CAFETERIA_MANAGER("Cafeteria Manager");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isEmployee() {
        return this == EMPLOYEE;
    }
    
    public boolean isVendor() {
        return this == VENDOR;
    }
    
    public boolean isAdmin() {
        return this == ADMIN || this == CAFETERIA_MANAGER;
    }
} 