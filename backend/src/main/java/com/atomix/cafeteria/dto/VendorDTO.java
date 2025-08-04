package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.VendorStatus;
import com.atomix.cafeteria.entity.VendorType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class VendorDTO {
    
    private Long id;
    
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
    
    @NotNull(message = "Vendor status is required")
    private VendorStatus status;
    
    private Boolean isActive;
    
    private String operatingHours;
    
    private String locationDescription;
    
    private List<String> floorIds;
    
    @NotNull(message = "Vendor type is required")
    private VendorType vendorType;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryStartDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryEndDate;
    
    private Double averageRating;
    
    private Integer totalReviews;
    
    private Integer totalMenuItems;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructors
    public VendorDTO() {}
    
    public VendorDTO(String name, String contactEmail, VendorType vendorType) {
        this.name = name;
        this.contactEmail = contactEmail;
        this.vendorType = vendorType;
        this.status = VendorStatus.PENDING;
        this.isActive = true;
        this.averageRating = 0.0;
        this.totalReviews = 0;
        this.totalMenuItems = 0;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public VendorStatus getStatus() {
        return status;
    }
    
    public void setStatus(VendorStatus status) {
        this.status = status;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Integer getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public Integer getTotalMenuItems() {
        return totalMenuItems;
    }
    
    public void setTotalMenuItems(Integer totalMenuItems) {
        this.totalMenuItems = totalMenuItems;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public boolean isTemporary() {
        return vendorType != null && vendorType.isTemporary();
    }
    
    public boolean isCurrentlyActive() {
        if (!isActive || status != VendorStatus.APPROVED) return false;
        
        if (isTemporary()) {
            LocalDateTime now = LocalDateTime.now();
            if (temporaryStartDate != null && now.isBefore(temporaryStartDate)) return false;
            if (temporaryEndDate != null && now.isAfter(temporaryEndDate)) return false;
        }
        
        return true;
    }
    
    public String getStatusDisplayName() {
        return status != null ? status.getDisplayName() : "";
    }
    
    public String getVendorTypeDisplayName() {
        return vendorType != null ? vendorType.getDisplayName() : "";
    }
} 