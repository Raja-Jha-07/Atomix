package com.atomix.cafeteria.dto;

import com.atomix.cafeteria.entity.VendorStatus;
import com.atomix.cafeteria.entity.VendorType;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class VendorResponse {
    
    private Long id;
    private String name;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String contactPerson;
    private String businessLicense;
    private String logoUrl;
    private VendorStatus status;
    private String statusDisplayName;
    private Boolean isActive;
    private String operatingHours;
    private String locationDescription;
    private List<String> floorIds;
    private VendorType vendorType;
    private String vendorTypeDisplayName;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryStartDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime temporaryEndDate;
    
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalMenuItems;
    private Boolean isCurrentlyActive;
    private Boolean isTemporary;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructors
    public VendorResponse() {}
    
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
        this.statusDisplayName = status != null ? status.getDisplayName() : "";
    }
    
    public String getStatusDisplayName() {
        return statusDisplayName;
    }
    
    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
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
        this.vendorTypeDisplayName = vendorType != null ? vendorType.getDisplayName() : "";
        this.isTemporary = vendorType != null && vendorType.isTemporary();
    }
    
    public String getVendorTypeDisplayName() {
        return vendorTypeDisplayName;
    }
    
    public void setVendorTypeDisplayName(String vendorTypeDisplayName) {
        this.vendorTypeDisplayName = vendorTypeDisplayName;
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
    
    public Boolean getIsCurrentlyActive() {
        return isCurrentlyActive;
    }
    
    public void setIsCurrentlyActive(Boolean isCurrentlyActive) {
        this.isCurrentlyActive = isCurrentlyActive;
    }
    
    public Boolean getIsTemporary() {
        return isTemporary;
    }
    
    public void setIsTemporary(Boolean isTemporary) {
        this.isTemporary = isTemporary;
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
} 