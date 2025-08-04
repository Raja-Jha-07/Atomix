package com.atomix.cafeteria.service;

import com.atomix.cafeteria.dto.MenuItemRequest;
import com.atomix.cafeteria.entity.MenuItem;
import com.atomix.cafeteria.entity.MenuCategory;
import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.entity.Vendor;
import com.atomix.cafeteria.repository.MenuItemRepository;
import com.atomix.cafeteria.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private VendorRepository vendorRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public Page<MenuItem> getAllMenuItems(Pageable pageable) {
        return menuItemRepository.findAll(pageable);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    public List<MenuItem> getMenuItemsByCategory(MenuCategory category) {
        return menuItemRepository.findByCategory(category);
    }

    public List<MenuItem> getMenuItemsByVendor(Long vendorId) {
        return menuItemRepository.findByVendorId(vendorId);
    }

    public List<MenuItem> getMenuItemsByFloor(String floorId) {
        return menuItemRepository.findByFloorId(floorId);
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> searchMenuItems(String searchTerm) {
        return menuItemRepository.searchByNameOrDescription(searchTerm);
    }

    public MenuItem saveMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        menuItem.setName(menuItemDetails.getName());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setCategory(menuItemDetails.getCategory());
        menuItem.setImageUrl(menuItemDetails.getImageUrl());
        menuItem.setIsAvailable(menuItemDetails.getIsAvailable());
        menuItem.setPreparationTime(menuItemDetails.getPreparationTime());
        menuItem.setCalories(menuItemDetails.getCalories());
        menuItem.setProteinGrams(menuItemDetails.getProteinGrams());
        menuItem.setFatGrams(menuItemDetails.getFatGrams());
        menuItem.setCarbsGrams(menuItemDetails.getCarbsGrams());
        menuItem.setIngredients(menuItemDetails.getIngredients());
        menuItem.setTags(menuItemDetails.getTags());

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        menuItemRepository.delete(menuItem);
    }

    public MenuItem updateAvailability(Long id, boolean isAvailable) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        menuItem.setIsAvailable(isAvailable);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem voteForMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        menuItem.incrementVotes();
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> getPopularMenuItems(int limit) {
        return menuItemRepository.findTopByOrderByVotesCountDesc(limit);
    }

    public List<MenuItem> getHighlyRatedMenuItems() {
        return menuItemRepository.findByRatingGreaterThanOrderByRatingDesc(4.0);
    }

    // Vendor-specific methods
    public Page<MenuItem> getAllMenuItems(Pageable pageable, String category, String vendorName, Boolean available) {
        Specification<MenuItem> spec = Specification.where(null);

        if (category != null && !category.isEmpty()) {
            try {
                MenuCategory menuCategory = MenuCategory.valueOf(category.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), menuCategory));
            } catch (IllegalArgumentException e) {
                // Invalid category, ignore filter
            }
        }

        if (vendorName != null && !vendorName.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                cb.like(cb.lower(root.get("vendor").get("name")), "%" + vendorName.toLowerCase() + "%"));
        }

        if (available != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isAvailable"), available));
        }

        return menuItemRepository.findAll(spec, pageable);
    }

    public MenuItem createMenuItem(MenuItemRequest request, User currentUser) {
        MenuItem menuItem = new MenuItem();
        mapRequestToEntity(request, menuItem);

        // Set vendor if user is a vendor
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = vendorRepository.findByContactEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Vendor not found for user: " + currentUser.getEmail()));
            menuItem.setVendor(vendor);
        }

        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItemRequest request, User currentUser) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        // Check if vendor can only update their own items
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = vendorRepository.findByContactEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Vendor not found for user: " + currentUser.getEmail()));

            if (!menuItem.getVendor().getId().equals(vendor.getId())) {
                throw new RuntimeException("Vendors can only update their own menu items");
            }
        }

        mapRequestToEntity(request, menuItem);
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id, User currentUser) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        // Check if vendor can only delete their own items
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = vendorRepository.findByContactEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Vendor not found for user: " + currentUser.getEmail()));

            if (!menuItem.getVendor().getId().equals(vendor.getId())) {
                throw new RuntimeException("Vendors can only delete their own menu items");
            }
        }

        menuItemRepository.delete(menuItem);
    }

    public Page<MenuItem> getVendorMenuItems(String vendorEmail, Pageable pageable) {
        Vendor vendor = vendorRepository.findByContactEmail(vendorEmail)
            .orElseThrow(() -> new RuntimeException("Vendor not found for email: " + vendorEmail));

        return menuItemRepository.findByVendorId(vendor.getId(), pageable);
    }

    public MenuItem toggleAvailability(Long id, User currentUser) {
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        // Check if vendor can only toggle their own items
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = vendorRepository.findByContactEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Vendor not found for user: " + currentUser.getEmail()));

            if (!menuItem.getVendor().getId().equals(vendor.getId())) {
                throw new RuntimeException("Vendors can only toggle availability of their own menu items");
            }
        }

        menuItem.setIsAvailable(!menuItem.getIsAvailable());
        return menuItemRepository.save(menuItem);
    }

    private void mapRequestToEntity(MenuItemRequest request, MenuItem menuItem) {
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setCategory(MenuCategory.valueOf(request.getCategory().toUpperCase()));
        menuItem.setImageUrl(request.getImageUrl());
        menuItem.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);
        menuItem.setPreparationTime(request.getPreparationTime());
        menuItem.setCalories(request.getCalories());
        
        // Convert Double to Integer for nutrition values
        if (request.getProteinGrams() != null) {
            menuItem.setProteinGrams(request.getProteinGrams().intValue());
        }
        if (request.getFatGrams() != null) {
            menuItem.setFatGrams(request.getFatGrams().intValue());
        }
        if (request.getCarbsGrams() != null) {
            menuItem.setCarbsGrams(request.getCarbsGrams().intValue());
        }
        
        menuItem.setIngredients(request.getIngredients());
        menuItem.setTags(request.getTags());
        // Note: nutritionInfo field doesn't exist in MenuItem entity
    }
}