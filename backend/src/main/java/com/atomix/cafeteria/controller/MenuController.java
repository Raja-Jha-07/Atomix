package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.MenuItemRequest;
import com.atomix.cafeteria.dto.MenuItemResponse;
import com.atomix.cafeteria.entity.MenuCategory;
import com.atomix.cafeteria.entity.MenuItem;
import com.atomix.cafeteria.entity.User;

import com.atomix.cafeteria.repository.MenuItemRepository;
import com.atomix.cafeteria.repository.VendorRepository;
import com.atomix.cafeteria.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // Get all menu items (public for employees)
    @GetMapping
    public ResponseEntity<Page<MenuItemResponse>> getAllMenuItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String vendorName,
            @RequestParam(required = false) Boolean available) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<MenuItem> menuItems = menuService.getAllMenuItems(pageable, category, vendorName, available);
        Page<MenuItemResponse> response = menuItems.map(this::convertToResponse);
        
        return ResponseEntity.ok(response);
    }

    // Create menu item (vendor/admin only)
    @PostMapping
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @Valid @RequestBody MenuItemRequest request,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        MenuItem menuItem = menuService.createMenuItem(request, currentUser);
        MenuItemResponse response = convertToResponse(menuItem);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Update menu item (vendor can only update own items)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        MenuItem menuItem = menuService.updateMenuItem(id, request, currentUser);
        MenuItemResponse response = convertToResponse(menuItem);
        
        return ResponseEntity.ok(response);
    }

    // Delete menu item (vendor can only delete own items)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        menuService.deleteMenuItem(id, currentUser);
        
        return ResponseEntity.noContent().build();
    }

    // Get current vendor's menu items
    @GetMapping("/my-items")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Page<MenuItemResponse>> getMyMenuItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<MenuItem> menuItems = menuService.getVendorMenuItems(currentUser.getEmail(), pageable);
        Page<MenuItemResponse> response = menuItems.map(this::convertToResponse);
        
        return ResponseEntity.ok(response);
    }

    // Toggle item availability
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<MenuItemResponse> toggleAvailability(
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        MenuItem menuItem = menuService.toggleAvailability(id, currentUser);
        MenuItemResponse response = convertToResponse(menuItem);
        
        return ResponseEntity.ok(response);
    }

    // Get menu categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getMenuCategories() {
        List<String> categories = Arrays.stream(MenuCategory.values())
                .map(MenuCategory::getDisplayName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // Get menu item by ID
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuItemRepository.findById(id);
        if (menuItem.isPresent()) {
            MenuItemResponse response = convertToResponse(menuItem.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    private MenuItemResponse convertToResponse(MenuItem menuItem) {
        MenuItemResponse response = new MenuItemResponse();
        response.setId(menuItem.getId());
        response.setName(menuItem.getName());
        response.setDescription(menuItem.getDescription());
        response.setPrice(menuItem.getPrice());
        response.setCategory(menuItem.getCategory().getDisplayName());
        response.setImageUrl(menuItem.getImageUrl());
        response.setIsAvailable(menuItem.getIsAvailable());
        response.setPreparationTime(menuItem.getPreparationTime());
        response.setIngredients(menuItem.getIngredients());
        response.setTags(menuItem.getTags());
        // Note: nutritionInfo field doesn't exist in MenuItem entity
        response.setCreatedAt(menuItem.getCreatedAt());
        response.setUpdatedAt(menuItem.getUpdatedAt());
        
        if (menuItem.getVendor() != null) {
            response.setVendorId(menuItem.getVendor().getId());
            response.setVendorName(menuItem.getVendor().getName());
        }
        
        return response;
    }
}
