package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.*;
import com.atomix.cafeteria.entity.VendorStatus;
import com.atomix.cafeteria.entity.VendorType;
import com.atomix.cafeteria.service.VendorService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600)
public class VendorController {
    
    private static final Logger logger = LoggerFactory.getLogger(VendorController.class);
    
    private final VendorService vendorService;
    
    @Autowired
    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }
    
    /**
     * Create a new vendor
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> createVendor(@Valid @RequestBody VendorRequest request) {
        try {
            logger.info("Creating new vendor: {}", request.getName());
            logger.debug("Vendor request details: {}", request);
            
            VendorResponse vendor = vendorService.createVendor(request);
            
            logger.info("Successfully created vendor with ID: {}", vendor.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Vendor created successfully", vendor));
                
        } catch (RuntimeException e) {
            logger.error("Business logic error creating vendor: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error creating vendor: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>("Internal server error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get vendor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable Long id) {
        try {
            VendorResponse vendor = vendorService.getVendorById(id);
            return ResponseEntity.ok(new ApiResponse<>("Vendor retrieved successfully", vendor));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendor with ID {}: ", id, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all vendors with pagination and sorting
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getAllVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Page<VendorResponse> vendors = vendorService.getAllVendors(page, size, sortBy, sortDir);
            return ResponseEntity.ok(new ApiResponse<>("Vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendors: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get vendors by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getVendorsByStatus(
            @PathVariable VendorStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.getVendorsByStatus(status, page, size);
            return ResponseEntity.ok(new ApiResponse<>("Vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendors by status {}: ", status, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get currently active vendors
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getCurrentlyActiveVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.getCurrentlyActiveVendors(page, size);
            return ResponseEntity.ok(new ApiResponse<>("Active vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving active vendors: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get vendors by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getVendorsByType(
            @PathVariable VendorType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.getVendorsByType(type, page, size);
            return ResponseEntity.ok(new ApiResponse<>("Vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendors by type {}: ", type, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get vendors by floor
     */
    @GetMapping("/floor/{floorId}")
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getVendorsByFloor(
            @PathVariable String floorId,
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        try {
            List<VendorResponse> vendors = vendorService.getVendorsByFloor(floorId, activeOnly);
            return ResponseEntity.ok(new ApiResponse<>("Vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendors by floor {}: ", floorId, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Search vendors
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> searchVendors(
            @RequestParam String q,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.searchVendors(q, activeOnly, page, size);
            return ResponseEntity.ok(new ApiResponse<>("Search results retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error searching vendors with query '{}': ", q, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Update vendor
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER') or (hasRole('VENDOR') and @vendorService.getVendorById(#id).contactEmail == authentication.name)")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {
        try {
            logger.info("Updating vendor with ID: {}", id);
            
            VendorResponse vendor = vendorService.updateVendor(id, request);
            
            return ResponseEntity.ok(new ApiResponse<>("Vendor updated successfully", vendor));
            
        } catch (Exception e) {
            logger.error("Error updating vendor with ID {}: ", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Update vendor status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendorStatus(
            @PathVariable Long id,
            @Valid @RequestBody VendorStatusUpdateRequest request) {
        try {
            logger.info("Updating vendor status for ID: {} to {}", id, request.getStatus());
            
            VendorResponse vendor = vendorService.updateVendorStatus(id, request);
            
            return ResponseEntity.ok(new ApiResponse<>("Vendor status updated successfully", vendor));
            
        } catch (Exception e) {
            logger.error("Error updating vendor status for ID {}: ", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Toggle vendor active status
     */
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> toggleVendorActiveStatus(@PathVariable Long id) {
        try {
            VendorResponse vendor = vendorService.toggleVendorActiveStatus(id);
            
            String message = vendor.getIsActive() ? 
                "Vendor activated successfully" : "Vendor deactivated successfully";
            
            return ResponseEntity.ok(new ApiResponse<>(message, vendor));
            
        } catch (Exception e) {
            logger.error("Error toggling vendor active status for ID {}: ", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Delete vendor
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable Long id) {
        try {
            vendorService.deleteVendor(id);
            return ResponseEntity.ok(new ApiResponse<>("Vendor deleted successfully", null));
            
        } catch (Exception e) {
            logger.error("Error deleting vendor with ID {}: ", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get pending approval vendors
     */
    @GetMapping("/pending-approval")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getPendingApprovalVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.getPendingApprovalVendors(page, size);
            return ResponseEntity.ok(new ApiResponse<>("Pending vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving pending approval vendors: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get high-rated vendors
     */
    @GetMapping("/high-rated")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getHighRatedVendors(
            @RequestParam(defaultValue = "4.0") Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<VendorResponse> vendors = vendorService.getHighRatedVendors(minRating, page, size);
            return ResponseEntity.ok(new ApiResponse<>("High-rated vendors retrieved successfully", vendors));
            
        } catch (Exception e) {
            logger.error("Error retrieving high-rated vendors: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get vendor statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVendorStatistics() {
        try {
            Map<String, Object> statistics = vendorService.getVendorStatistics();
            return ResponseEntity.ok(new ApiResponse<>("Statistics retrieved successfully", statistics));
            
        } catch (Exception e) {
            logger.error("Error retrieving vendor statistics: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Update vendor rating
     */
    @PatchMapping("/{id}/rating")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendorRating(
            @PathVariable Long id,
            @RequestParam Double rating) {
        try {
            VendorResponse vendor = vendorService.updateVendorRating(id, rating);
            return ResponseEntity.ok(new ApiResponse<>("Vendor rating updated successfully", vendor));
            
        } catch (Exception e) {
            logger.error("Error updating vendor rating for ID {}: ", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Handle expired temporary vendors (scheduled task endpoint)
     */
    @PostMapping("/handle-expired")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SYSTEM')")
    public ResponseEntity<ApiResponse<Void>> handleExpiredTemporaryVendors() {
        try {
            vendorService.handleExpiredTemporaryVendors();
            return ResponseEntity.ok(new ApiResponse<>("Expired vendors processed successfully", null));
            
        } catch (Exception e) {
            logger.error("Error handling expired temporary vendors: ", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get vendor types enum values
     */
    @GetMapping("/types")
    public ResponseEntity<ApiResponse<VendorType[]>> getVendorTypes() {
        return ResponseEntity.ok(new ApiResponse<>("Vendor types retrieved successfully", VendorType.values()));
    }
    
    /**
     * Get vendor status enum values
     */
    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<VendorStatus[]>> getVendorStatuses() {
        return ResponseEntity.ok(new ApiResponse<>("Vendor statuses retrieved successfully", VendorStatus.values()));
    }
} 