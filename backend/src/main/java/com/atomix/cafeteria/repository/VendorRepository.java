package com.atomix.cafeteria.repository;

import com.atomix.cafeteria.entity.Vendor;
import com.atomix.cafeteria.entity.VendorStatus;
import com.atomix.cafeteria.entity.VendorType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    // Basic queries
    Optional<Vendor> findByName(String name);
    Optional<Vendor> findByContactEmail(String contactEmail);
    
    // Status-based queries
    List<Vendor> findByStatus(VendorStatus status);
    Page<Vendor> findByStatus(VendorStatus status, Pageable pageable);
    
    // Active vendors
    List<Vendor> findByIsActiveTrue();
    Page<Vendor> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    
    // Type-based queries
    List<Vendor> findByVendorType(VendorType vendorType);
    Page<Vendor> findByVendorType(VendorType vendorType, Pageable pageable);
    
    // Currently active vendors (considering status, isActive, and temporary dates)
    @Query("SELECT v FROM Vendor v WHERE v.isActive = true AND v.status = 'APPROVED' " +
           "AND (v.vendorType = 'PERMANENT' OR " +
           "(v.vendorType IN ('TEMPORARY', 'SEASONAL', 'EVENT_BASED') AND " +
           "(v.temporaryStartDate IS NULL OR v.temporaryStartDate <= :now) AND " +
           "(v.temporaryEndDate IS NULL OR v.temporaryEndDate >= :now)))")
    List<Vendor> findCurrentlyActiveVendors(@Param("now") LocalDateTime now);
    
    @Query("SELECT v FROM Vendor v WHERE v.isActive = true AND v.status = 'APPROVED' " +
           "AND (v.vendorType = 'PERMANENT' OR " +
           "(v.vendorType IN ('TEMPORARY', 'SEASONAL', 'EVENT_BASED') AND " +
           "(v.temporaryStartDate IS NULL OR v.temporaryStartDate <= :now) AND " +
           "(v.temporaryEndDate IS NULL OR v.temporaryEndDate >= :now))) " +
           "ORDER BY v.averageRating DESC, v.name")
    Page<Vendor> findCurrentlyActiveVendors(@Param("now") LocalDateTime now, Pageable pageable);
    
    // Floor-based queries
    @Query("SELECT v FROM Vendor v WHERE :floorId MEMBER OF v.floorIds")
    List<Vendor> findByFloorId(@Param("floorId") String floorId);
    
    @Query("SELECT v FROM Vendor v WHERE :floorId MEMBER OF v.floorIds AND v.isActive = true AND v.status = 'APPROVED'")
    List<Vendor> findActiveVendorsByFloorId(@Param("floorId") String floorId);
    
    // Search queries
    @Query("SELECT v FROM Vendor v WHERE " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.contactPerson) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Vendor> searchVendors(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT v FROM Vendor v WHERE " +
           "(LOWER(v.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.contactPerson) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND v.isActive = true AND v.status = 'APPROVED'")
    Page<Vendor> searchActiveVendors(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Rating-based queries
    List<Vendor> findByAverageRatingGreaterThanEqualOrderByAverageRatingDesc(Double rating);
    
    @Query("SELECT v FROM Vendor v WHERE v.averageRating >= :minRating AND v.isActive = true AND v.status = 'APPROVED' " +
           "ORDER BY v.averageRating DESC, v.totalReviews DESC")
    Page<Vendor> findHighRatedActiveVendors(@Param("minRating") Double minRating, Pageable pageable);
    
    // Temporary vendor queries
    @Query("SELECT v FROM Vendor v WHERE v.vendorType IN ('TEMPORARY', 'SEASONAL', 'EVENT_BASED') " +
           "AND v.temporaryEndDate < :now AND v.status = 'APPROVED'")
    List<Vendor> findExpiredTemporaryVendors(@Param("now") LocalDateTime now);
    
    @Query("SELECT v FROM Vendor v WHERE v.vendorType IN ('TEMPORARY', 'SEASONAL', 'EVENT_BASED') " +
           "AND v.temporaryStartDate > :now AND v.status = 'APPROVED'")
    List<Vendor> findUpcomingTemporaryVendors(@Param("now") LocalDateTime now);
    
    // Statistics queries
    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.status = :status")
    Long countByStatus(@Param("status") VendorStatus status);
    
    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.isActive = true AND v.status = 'APPROVED'")
    Long countActiveVendors();
    
    @Query("SELECT v.vendorType, COUNT(v) FROM Vendor v WHERE v.isActive = true GROUP BY v.vendorType")
    List<Object[]> getVendorTypeStatistics();
    
    // Vendor approval queue
    @Query("SELECT v FROM Vendor v WHERE v.status = 'PENDING' ORDER BY v.createdAt ASC")
    Page<Vendor> findPendingApprovalVendors(Pageable pageable);
    
    // Recent vendors
    @Query("SELECT v FROM Vendor v ORDER BY v.createdAt DESC")
    Page<Vendor> findRecentVendors(Pageable pageable);
} 