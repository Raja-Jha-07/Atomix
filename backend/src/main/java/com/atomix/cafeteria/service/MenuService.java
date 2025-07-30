package com.atomix.cafeteria.service;

import com.atomix.cafeteria.entity.MenuItem;
import com.atomix.cafeteria.entity.MenuCategory;
import com.atomix.cafeteria.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

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
} 