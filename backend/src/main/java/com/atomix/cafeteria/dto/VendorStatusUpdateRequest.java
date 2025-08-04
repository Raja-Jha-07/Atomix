package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.VendorStatus;
import jakarta.validation.constraints.NotNull;

public class VendorStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private VendorStatus status;
    
    private String reason;
    
    // Constructors
    public VendorStatusUpdateRequest() {}
    
    public VendorStatusUpdateRequest(VendorStatus status) {
        this.status = status;
    }
    
    public VendorStatusUpdateRequest(VendorStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }
    
    // Getters and Setters
    public VendorStatus getStatus() {
        return status;
    }
    
    public void setStatus(VendorStatus status) {
        this.status = status;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
} 