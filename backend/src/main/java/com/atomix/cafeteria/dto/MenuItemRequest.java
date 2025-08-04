package com.atomix.cafeteria.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

public class MenuItemRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String imageUrl;
    
    private Boolean isAvailable = true;
    
    @PositiveOrZero(message = "Preparation time must be non-negative")
    private Integer preparationTime;
    
    @PositiveOrZero(message = "Calories must be non-negative")
    private Integer calories;
    
    @PositiveOrZero(message = "Protein grams must be non-negative")
    private Double proteinGrams;
    
    @PositiveOrZero(message = "Fat grams must be non-negative")
    private Double fatGrams;
    
    @PositiveOrZero(message = "Carbs grams must be non-negative")
    private Double carbsGrams;
    
    private List<String> ingredients;
    
    private List<String> tags;
    
    private String nutritionInfo;

    // Default constructor
    public MenuItemRequest() {}

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
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

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Double getProteinGrams() {
        return proteinGrams;
    }

    public void setProteinGrams(Double proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public Double getFatGrams() {
        return fatGrams;
    }

    public void setFatGrams(Double fatGrams) {
        this.fatGrams = fatGrams;
    }

    public Double getCarbsGrams() {
        return carbsGrams;
    }

    public void setCarbsGrams(Double carbsGrams) {
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

    public String getNutritionInfo() {
        return nutritionInfo;
    }

    public void setNutritionInfo(String nutritionInfo) {
        this.nutritionInfo = nutritionInfo;
    }
}
