package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.VendorType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class VendorRequest {
    
    @NotBlank(message = "Vendor name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;
    
    private String contactPhone;
    
    private String contactPerson;
    
    private String businessLicense;
    
    private String logoUrl;
    
    private String operatingHours;
    
    private String locationDescription;
    
    private List<String> floorIds;
    
    @NotNull(message = "Vendor type is required")
    private VendorType vendorType;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryStartDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryEndDate;
    
    // Constructors
    public VendorRequest() {}
    
    public VendorRequest(String name, String contactEmail, VendorType vendorType) {
        this.name = name;
        this.contactEmail = contactEmail;
        this.vendorType = vendorType;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getContactEmail() {
        return contactEmail;
    }
    
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }
    
    public String getContactPhone() {
        return contactPhone;
    }
    
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
    
    public String getContactPerson() {
        return contactPerson;
    }
    
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
    
    public String getBusinessLicense() {
        return businessLicense;
    }
    
    public void setBusinessLicense(String businessLicense) {
        this.businessLicense = businessLicense;
    }
    
    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    
    public String getOperatingHours() {
        return operatingHours;
    }
    
    public void setOperatingHours(String operatingHours) {
        this.operatingHours = operatingHours;
    }
    
    public String getLocationDescription() {
        return locationDescription;
    }
    
    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }
    
    public List<String> getFloorIds() {
        return floorIds;
    }
    
    public void setFloorIds(List<String> floorIds) {
        this.floorIds = floorIds;
    }
    
    public VendorType getVendorType() {
        return vendorType;
    }
    
    public void setVendorType(VendorType vendorType) {
        this.vendorType = vendorType;
    }
    
    public LocalDateTime getTemporaryStartDate() {
        return temporaryStartDate;
    }
    
    public void setTemporaryStartDate(LocalDateTime temporaryStartDate) {
        this.temporaryStartDate = temporaryStartDate;
    }
    
    public LocalDateTime getTemporaryEndDate() {
        return temporaryEndDate;
    }
    
    public void setTemporaryEndDate(LocalDateTime temporaryEndDate) {
        this.temporaryEndDate = temporaryEndDate;
    }
    
    // Validation helper methods
    public boolean isTemporaryVendor() {
        return vendorType != null && vendorType.isTemporary();
    }
    
    public boolean hasValidDateRange() {
        if (!isTemporaryVendor()) return true;
        
        if (temporaryStartDate == null || temporaryEndDate == null) {
            return false;
        }
        
        return temporaryStartDate.isBefore(temporaryEndDate);
    }
} 