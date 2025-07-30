package com.atomix.cafeteria.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_items")
@EntityListeners(AuditingEntityListener.class)
public class MenuItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuCategory category;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @PositiveOrZero
    @Column(name = "preparation_time")
    private Integer preparationTime; // in minutes
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
    
    @Column(name = "floor_id")
    private String floorId;
    
    // Nutrition information
    @PositiveOrZero
    private Integer calories;
    
    @PositiveOrZero
    @Column(name = "protein_grams")
    private Integer proteinGrams;
    
    @PositiveOrZero
    @Column(name = "fat_grams")
    private Integer fatGrams;
    
    @PositiveOrZero
    @Column(name = "carbs_grams")
    private Integer carbsGrams;
    
    // Ingredients and tags
    @ElementCollection
    @CollectionTable(name = "menu_item_ingredients", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "ingredient")
    private List<String> ingredients = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "menu_item_tags", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    // Voting and rating
    @PositiveOrZero
    @Column(name = "votes_count")
    private Integer votesCount = 0;
    
    @DecimalMin(value = "0.0")
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    
    @PositiveOrZero
    @Column(name = "rating_count")
    private Integer ratingCount = 0;
    
    // Inventory tracking
    @PositiveOrZero
    @Column(name = "quantity_available")
    private Integer quantityAvailable;
    
    @Column(name = "is_limited_quantity")
    private Boolean isLimitedQuantity = false;
    
    // Time-based availability
    @Column(name = "available_from")
    private LocalDateTime availableFrom;
    
    @Column(name = "available_until")
    private LocalDateTime availableUntil;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public MenuItem() {}
    
    public MenuItem(String name, String description, BigDecimal price, MenuCategory category, Vendor vendor) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.vendor = vendor;
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
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public MenuCategory getCategory() {
        return category;
    }
    
    public void setCategory(MenuCategory category) {
        this.category = category;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public Integer getPreparationTime() {
        return preparationTime;
    }
    
    public void setPreparationTime(Integer preparationTime) {
        this.preparationTime = preparationTime;
    }
    
    public Vendor getVendor() {
        return vendor;
    }
    
    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }
    
    public String getFloorId() {
        return floorId;
    }
    
    public void setFloorId(String floorId) {
        this.floorId = floorId;
    }
    
    public Integer getCalories() {
        return calories;
    }
    
    public void setCalories(Integer calories) {
        this.calories = calories;
    }
    
    public Integer getProteinGrams() {
        return proteinGrams;
    }
    
    public void setProteinGrams(Integer proteinGrams) {
        this.proteinGrams = proteinGrams;
    }
    
    public Integer getFatGrams() {
        return fatGrams;
    }
    
    public void setFatGrams(Integer fatGrams) {
        this.fatGrams = fatGrams;
    }
    
    public Integer getCarbsGrams() {
        return carbsGrams;
    }
    
    public void setCarbsGrams(Integer carbsGrams) {
        this.carbsGrams = carbsGrams;
    }
    
    public List<String> getIngredients() {
        return ingredients;
    }
    
    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public Integer getVotesCount() {
        return votesCount;
    }
    
    public void setVotesCount(Integer votesCount) {
        this.votesCount = votesCount;
    }
    
    public BigDecimal getRating() {
        return rating;
    }
    
    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public Integer getRatingCount() {
        return ratingCount;
    }
    
    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }
    
    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }
    
    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }
    
    public Boolean getIsLimitedQuantity() {
        return isLimitedQuantity;
    }
    
    public void setIsLimitedQuantity(Boolean isLimitedQuantity) {
        this.isLimitedQuantity = isLimitedQuantity;
    }
    
    public LocalDateTime getAvailableFrom() {
        return availableFrom;
    }
    
    public void setAvailableFrom(LocalDateTime availableFrom) {
        this.availableFrom = availableFrom;
    }
    
    public LocalDateTime getAvailableUntil() {
        return availableUntil;
    }
    
    public void setAvailableUntil(LocalDateTime availableUntil) {
        this.availableUntil = availableUntil;
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
    public void incrementVotes() {
        this.votesCount = (this.votesCount == null ? 0 : this.votesCount) + 1;
    }
    
    public void updateRating(BigDecimal newRating) {
        if (this.ratingCount == null || this.ratingCount == 0) {
            this.rating = newRating;
            this.ratingCount = 1;
        } else {
            BigDecimal totalRating = this.rating.multiply(new BigDecimal(this.ratingCount));
            totalRating = totalRating.add(newRating);
            this.ratingCount++;
            this.rating = totalRating.divide(new BigDecimal(this.ratingCount), 2, BigDecimal.ROUND_HALF_UP);
        }
    }
    
    public boolean isCurrentlyAvailable() {
        if (!isAvailable) return false;
        
        LocalDateTime now = LocalDateTime.now();
        if (availableFrom != null && now.isBefore(availableFrom)) return false;
        if (availableUntil != null && now.isAfter(availableUntil)) return false;
        if (isLimitedQuantity && (quantityAvailable == null || quantityAvailable <= 0)) return false;
        
        return true;
    }
} 