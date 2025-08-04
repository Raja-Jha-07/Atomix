package com.atomix.cafeteria.service;

import com.atomix.cafeteria.dto.*;
import com.atomix.cafeteria.entity.Vendor;
import com.atomix.cafeteria.entity.VendorStatus;
import com.atomix.cafeteria.entity.VendorType;
import com.atomix.cafeteria.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VendorService {
    
    private static final Logger logger = LoggerFactory.getLogger(VendorService.class);
    
    private final VendorRepository vendorRepository;
    private final ModelMapper modelMapper;
    
    @Autowired
    public VendorService(VendorRepository vendorRepository, ModelMapper modelMapper) {
        this.vendorRepository = vendorRepository;
        this.modelMapper = modelMapper;
    }
    
    /**
     * Create a new vendor
     */
    public VendorResponse createVendor(VendorRequest request) {
        logger.info("Creating new vendor: {}", request.getName());
        logger.debug("Vendor request details: name={}, email={}, type={}", 
                    request.getName(), request.getContactEmail(), request.getVendorType());
        
        try {
            // Validate request
            validateVendorRequest(request);
            logger.debug("Vendor request validation passed");
            
            // Check for duplicate name or email
            if (vendorRepository.findByName(request.getName()).isPresent()) {
                logger.warn("Vendor creation failed: Name '{}' already exists", request.getName());
                throw new RuntimeException("Vendor with name '" + request.getName() + "' already exists");
            }
            
            if (vendorRepository.findByContactEmail(request.getContactEmail()).isPresent()) {
                logger.warn("Vendor creation failed: Email '{}' already exists", request.getContactEmail());
                throw new RuntimeException("Vendor with email '" + request.getContactEmail() + "' already exists");
            }
            
            logger.debug("Duplicate check passed, proceeding with entity creation");
            
            // Create vendor entity
            Vendor vendor = modelMapper.map(request, Vendor.class);
            vendor.setStatus(VendorStatus.PENDING);
            vendor.setIsActive(true);
            vendor.setAverageRating(0.0);
            vendor.setTotalReviews(0);
            
            logger.debug("Vendor entity created, saving to database");
            
            // Save vendor
            vendor = vendorRepository.save(vendor);
            
            logger.info("Successfully created vendor with ID: {}", vendor.getId());
            return mapToVendorResponse(vendor);
            
        } catch (RuntimeException e) {
            logger.error("Runtime error creating vendor: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error creating vendor: ", e);
            throw new RuntimeException("Failed to create vendor: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get vendor by ID
     */
    @Transactional(readOnly = true)
    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + id));
        
        return mapToVendorResponse(vendor);
    }
    
    /**
     * Get all vendors with pagination
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getAllVendors(int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Vendor> vendors = vendorRepository.findAll(pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get vendors by status
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getVendorsByStatus(VendorStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Vendor> vendors = vendorRepository.findByStatus(status, pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get currently active vendors
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getCurrentlyActiveVendors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vendor> vendors = vendorRepository.findCurrentlyActiveVendors(LocalDateTime.now(), pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get vendors by type
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getVendorsByType(VendorType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        Page<Vendor> vendors = vendorRepository.findByVendorType(type, pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get vendors by floor
     */
    @Transactional(readOnly = true)
    public List<VendorResponse> getVendorsByFloor(String floorId, boolean activeOnly) {
        List<Vendor> vendors;
        if (activeOnly) {
            vendors = vendorRepository.findActiveVendorsByFloorId(floorId);
        } else {
            vendors = vendorRepository.findByFloorId(floorId);
        }
        
        return vendors.stream()
            .map(this::mapToVendorResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Search vendors
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> searchVendors(String searchTerm, boolean activeOnly, int page, int size) {
        if (activeOnly) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("averageRating").descending());
            Page<Vendor> vendors = vendorRepository.searchActiveVendors(searchTerm, pageable);
            return vendors.map(this::mapToVendorResponse);
        } else {
            List<Vendor> vendors = vendorRepository.searchVendors(searchTerm);
            // Convert to Page manually for consistency
            int start = (int) PageRequest.of(page, size).getOffset();
            int end = Math.min((start + size), vendors.size());
            List<Vendor> subList = vendors.subList(start, end);
            
            return new org.springframework.data.domain.PageImpl<>(
                subList.stream().map(this::mapToVendorResponse).collect(Collectors.toList()),
                PageRequest.of(page, size),
                vendors.size()
            );
        }
    }
    
    /**
     * Update vendor
     */
    public VendorResponse updateVendor(Long id, VendorRequest request) {
        logger.info("Updating vendor with ID: {}", id);
        
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + id));
        
        // Validate request
        validateVendorRequest(request);
        
        // Check for duplicate name or email (excluding current vendor)
        Optional<Vendor> existingNameVendor = vendorRepository.findByName(request.getName());
        if (existingNameVendor.isPresent() && !existingNameVendor.get().getId().equals(id)) {
            throw new RuntimeException("Vendor with name '" + request.getName() + "' already exists");
        }
        
        Optional<Vendor> existingEmailVendor = vendorRepository.findByContactEmail(request.getContactEmail());
        if (existingEmailVendor.isPresent() && !existingEmailVendor.get().getId().equals(id)) {
            throw new RuntimeException("Vendor with email '" + request.getContactEmail() + "' already exists");
        }
        
        // Update vendor fields
        vendor.setName(request.getName());
        vendor.setDescription(request.getDescription());
        vendor.setContactEmail(request.getContactEmail());
        vendor.setContactPhone(request.getContactPhone());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setBusinessLicense(request.getBusinessLicense());
        vendor.setLogoUrl(request.getLogoUrl());
        vendor.setOperatingHours(request.getOperatingHours());
        vendor.setLocationDescription(request.getLocationDescription());
        vendor.setFloorIds(request.getFloorIds());
        vendor.setVendorType(request.getVendorType());
        vendor.setTemporaryStartDate(request.getTemporaryStartDate());
        vendor.setTemporaryEndDate(request.getTemporaryEndDate());
        
        vendor = vendorRepository.save(vendor);
        
        logger.info("Updated vendor with ID: {}", id);
        return mapToVendorResponse(vendor);
    }
    
    /**
     * Update vendor status
     */
    public VendorResponse updateVendorStatus(Long id, VendorStatusUpdateRequest request) {
        logger.info("Updating vendor status for ID: {} to {}", id, request.getStatus());
        
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + id));
        
        VendorStatus oldStatus = vendor.getStatus();
        vendor.setStatus(request.getStatus());
        
        vendor = vendorRepository.save(vendor);
        
        logger.info("Updated vendor status from {} to {} for vendor ID: {}", 
                   oldStatus, request.getStatus(), id);
        
        return mapToVendorResponse(vendor);
    }
    
    /**
     * Toggle vendor active status
     */
    public VendorResponse toggleVendorActiveStatus(Long id) {
        logger.info("Toggling active status for vendor ID: {}", id);
        
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + id));
        
        vendor.setIsActive(!vendor.getIsActive());
        vendor = vendorRepository.save(vendor);
        
        logger.info("Toggled vendor active status to {} for vendor ID: {}", vendor.getIsActive(), id);
        return mapToVendorResponse(vendor);
    }
    
    /**
     * Delete vendor
     */
    public void deleteVendor(Long id) {
        logger.info("Deleting vendor with ID: {}", id);
        
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + id));
        
        // Check if vendor has associated menu items
        if (!vendor.getMenuItems().isEmpty()) {
            throw new RuntimeException("Cannot delete vendor with existing menu items. Please remove all menu items first.");
        }
        
        vendorRepository.delete(vendor);
        logger.info("Deleted vendor with ID: {}", id);
    }
    
    /**
     * Get pending approval vendors
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getPendingApprovalVendors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vendor> vendors = vendorRepository.findPendingApprovalVendors(pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get high-rated vendors
     */
    @Transactional(readOnly = true)
    public Page<VendorResponse> getHighRatedVendors(Double minRating, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vendor> vendors = vendorRepository.findHighRatedActiveVendors(minRating, pageable);
        return vendors.map(this::mapToVendorResponse);
    }
    
    /**
     * Get vendor statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getVendorStatistics() {
        Map<String, Object> stats = new java.util.HashMap<>();
        
        stats.put("totalVendors", vendorRepository.count());
        stats.put("activeVendors", vendorRepository.countActiveVendors());
        stats.put("pendingApproval", vendorRepository.countByStatus(VendorStatus.PENDING));
        stats.put("approvedVendors", vendorRepository.countByStatus(VendorStatus.APPROVED));
        stats.put("rejectedVendors", vendorRepository.countByStatus(VendorStatus.REJECTED));
        stats.put("suspendedVendors", vendorRepository.countByStatus(VendorStatus.SUSPENDED));
        
        // Vendor type statistics
        List<Object[]> typeStats = vendorRepository.getVendorTypeStatistics();
        Map<String, Long> vendorTypeStats = typeStats.stream()
            .collect(Collectors.toMap(
                arr -> ((VendorType) arr[0]).getDisplayName(),
                arr -> (Long) arr[1]
            ));
        stats.put("vendorTypeStatistics", vendorTypeStats);
        
        return stats;
    }
    
    /**
     * Handle expired temporary vendors
     */
    @Transactional
    public void handleExpiredTemporaryVendors() {
        List<Vendor> expiredVendors = vendorRepository.findExpiredTemporaryVendors(LocalDateTime.now());
        
        for (Vendor vendor : expiredVendors) {
            vendor.setIsActive(false);
            vendor.setStatus(VendorStatus.INACTIVE);
            vendorRepository.save(vendor);
            logger.info("Marked expired temporary vendor as inactive: {}", vendor.getName());
        }
        
        if (!expiredVendors.isEmpty()) {
            logger.info("Processed {} expired temporary vendors", expiredVendors.size());
        }
    }
    
    /**
     * Update vendor rating
     */
    public VendorResponse updateVendorRating(Long vendorId, Double rating) {
        logger.info("Updating rating for vendor ID: {} with rating: {}", vendorId, rating);
        
        if (rating < 1.0 || rating > 5.0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
        
        vendor.updateRating(rating);
        vendor = vendorRepository.save(vendor);
        
        logger.info("Updated vendor rating. New average: {}, Total reviews: {}", 
                   vendor.getAverageRating(), vendor.getTotalReviews());
        
        return mapToVendorResponse(vendor);
    }
    
    // Private helper methods
    
    private void validateVendorRequest(VendorRequest request) {
        if (request.isTemporaryVendor() && !request.hasValidDateRange()) {
            throw new RuntimeException("Temporary vendors must have valid start and end dates");
        }
        
        if (request.isTemporaryVendor() && 
            request.getTemporaryStartDate() != null && 
            request.getTemporaryStartDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Temporary vendor start date cannot be in the past");
        }
    }
    
    private VendorResponse mapToVendorResponse(Vendor vendor) {
        VendorResponse response = modelMapper.map(vendor, VendorResponse.class);
        
        // Set computed fields
        response.setStatusDisplayName(vendor.getStatus().getDisplayName());
        response.setVendorTypeDisplayName(vendor.getVendorType().getDisplayName());
        response.setIsCurrentlyActive(vendor.isCurrentlyActive());
        response.setIsTemporary(vendor.isTemporary());
        response.setTotalMenuItems(vendor.getMenuItems().size());
        
        return response;
    }
} 