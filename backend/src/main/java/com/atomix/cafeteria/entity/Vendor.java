package com.atomix.cafeteria.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendors")
@EntityListeners(AuditingEntityListener.class)
public class Vendor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Email
    @Column(name = "contact_email", nullable = false)
    private String contactEmail;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Column(name = "business_license")
    private String businessLicense;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VendorStatus status = VendorStatus.PENDING;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // Operating hours and location
    @Column(name = "operating_hours")
    private String operatingHours;
    
    @Column(name = "location_description")
    private String locationDescription;
    
    @ElementCollection
    @CollectionTable(name = "vendor_floor_mappings", joinColumns = @JoinColumn(name = "vendor_id"))
    @Column(name = "floor_id")
    private List<String> floorIds = new ArrayList<>();
    
    // Vendor type
    @Enumerated(EnumType.STRING)
    @Column(name = "vendor_type")
    private VendorType vendorType = VendorType.PERMANENT;
    
    // For temporary vendors
    @Column(name = "temporary_start_date")
    private LocalDateTime temporaryStartDate;
    
    @Column(name = "temporary_end_date")
    private LocalDateTime temporaryEndDate;
    
    // Rating and reviews
    @Column(name = "average_rating", precision = 3, scale = 2)
    private Double averageRating = 0.0;
    
    @Column(name = "total_reviews")
    private Integer totalReviews = 0;
    
    // Menu items relationship
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MenuItem> menuItems = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Vendor() {}
    
    public Vendor(String name, String contactEmail, VendorType vendorType) {
        this.name = name;
        this.contactEmail = contactEmail;
        this.vendorType = vendorType;
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
    
    public List<MenuItem> getMenuItems() {
        return menuItems;
    }
    
    public void setMenuItems(List<MenuItem> menuItems) {
        this.menuItems = menuItems;
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
        return vendorType == VendorType.TEMPORARY;
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
    
    public void updateRating(Double newRating) {
        if (totalReviews == 0) {
            averageRating = newRating;
            totalReviews = 1;
        } else {
            double totalRating = averageRating * totalReviews;
            totalRating += newRating;
            totalReviews++;
            averageRating = totalRating / totalReviews;
        }
    }
} 