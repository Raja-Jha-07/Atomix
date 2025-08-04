package com.atomix.cafeteria.entity;

public enum MenuCategory {
    BREAKFAST("Breakfast"),
    LUNCH("Lunch"),
    DINNER("Dinner"),
    SNACKS("Snacks"),
    BEVERAGES("Beverages"),
    DESSERTS("Desserts"),
    SALADS("Salads"),
    SOUPS("Soups");
    
    private final String displayName;
    
    MenuCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isMealCategory() {
        return this == BREAKFAST || this == LUNCH || this == DINNER;
    }
    
    public boolean isSnackCategory() {
        return this == SNACKS || this == BEVERAGES || this == DESSERTS;
    }
} 