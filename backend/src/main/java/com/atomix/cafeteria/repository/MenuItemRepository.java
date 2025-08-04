package com.atomix.cafeteria.repository;

import com.atomix.cafeteria.entity.MenuItem;
import com.atomix.cafeteria.entity.MenuCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>, JpaSpecificationExecutor<MenuItem> {
    
    List<MenuItem> findByCategory(MenuCategory category);
    
    List<MenuItem> findByVendorId(Long vendorId);
    
    List<MenuItem> findByFloorId(String floorId);
    
    List<MenuItem> findByIsAvailableTrue();
    
    List<MenuItem> findByVendorIdAndIsAvailableTrue(Long vendorId);
    
    List<MenuItem> findByCategoryAndIsAvailableTrue(MenuCategory category);
    
    List<MenuItem> findByFloorIdAndIsAvailableTrue(String floorId);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<MenuItem> searchByNameOrDescription(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
           "EXISTS (SELECT t FROM m.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :tag, '%')))")
    List<MenuItem> findByTagsContainingIgnoreCase(@Param("tag") String tag);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
           "EXISTS (SELECT i FROM m.ingredients i WHERE LOWER(i) LIKE LOWER(CONCAT('%', :ingredient, '%')))")
    List<MenuItem> findByIngredientsContainingIgnoreCase(@Param("ingredient") String ingredient);
    
    List<MenuItem> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<MenuItem> findByCaloriesLessThanEqual(Integer maxCalories);
    
    @Query("SELECT m FROM MenuItem m ORDER BY m.votesCount DESC")
    List<MenuItem> findTopByOrderByVotesCountDesc(@Param("limit") int limit);
    
    List<MenuItem> findByRatingGreaterThanOrderByRatingDesc(Double minRating);
    
    // Pageable methods for vendor operations
    Page<MenuItem> findByVendorId(Long vendorId, Pageable pageable);
    
    Page<MenuItem> findByVendorIdAndIsAvailableTrue(Long vendorId, Pageable pageable);
    
    Page<MenuItem> findByCategoryAndIsAvailableTrue(MenuCategory category, Pageable pageable);
    
    @Query("SELECT m FROM MenuItem m WHERE m.vendor.name LIKE %:vendorName% AND m.isAvailable = true")
    Page<MenuItem> findByVendorNameContainingAndIsAvailableTrue(@Param("vendorName") String vendorName, Pageable pageable);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND m.preparationTime <= :maxTime")
    List<MenuItem> findByPreparationTimeLessThanEqual(@Param("maxTime") Integer maxTime);
    
    @Query("SELECT COUNT(m) FROM MenuItem m WHERE m.vendor.id = :vendorId AND m.isAvailable = true")
    long countByVendorIdAndIsAvailableTrue(@Param("vendorId") Long vendorId);
    
    @Query("SELECT AVG(m.rating) FROM MenuItem m WHERE m.vendor.id = :vendorId")
    Double getAverageRatingByVendorId(@Param("vendorId") Long vendorId);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
           "m.availableFrom <= CURRENT_TIMESTAMP AND " +
           "m.availableUntil >= CURRENT_TIMESTAMP")
    List<MenuItem> findCurrentlyAvailableMenuItems();
} 