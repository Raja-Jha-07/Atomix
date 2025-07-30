package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.UserDTO;
import com.atomix.cafeteria.entity.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "APIs for user management operations")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class UserController {
    
    // TODO: Inject UserService when created
    // private final UserService userService;
    
    @Operation(summary = "Get all users", description = "Retrieve a paginated list of all users")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @Parameter(description = "Pagination information") Pageable pageable) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(Page.empty());
    }
    
    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER') or @userSecurity.isOwner(authentication, #id)")
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "User ID") @PathVariable Long id) {
        // TODO: Implement when UserService is available
        return ResponseEntity.notFound().build();
    }
    
    @Operation(summary = "Get current user", description = "Retrieve the currently authenticated user's information")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved current user")
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        // TODO: Implement when UserService and Security are available
        return ResponseEntity.ok(new UserDTO());
    }
    
    @Operation(summary = "Update user", description = "Update user information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER') or @userSecurity.isOwner(authentication, #id)")
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            @Parameter(description = "Updated user information") @Valid @RequestBody UserDTO userDTO) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(userDTO);
    }
    
    @Operation(summary = "Delete user", description = "Soft delete a user (mark as inactive)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "User deleted successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "User ID") @PathVariable Long id) {
        // TODO: Implement when UserService is available
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Search users", description = "Search users by name or email")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<Page<UserDTO>> searchUsers(
            @Parameter(description = "Search term") @RequestParam String query,
            @Parameter(description = "Pagination information") Pageable pageable) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(Page.empty());
    }
    
    @Operation(summary = "Get users by role", description = "Retrieve users filtered by role")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<List<UserDTO>> getUsersByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(List.of());
    }
    
    @Operation(summary = "Get users by floor", description = "Retrieve users filtered by floor ID")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @GetMapping("/floor/{floorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<List<UserDTO>> getUsersByFloor(
            @Parameter(description = "Floor ID") @PathVariable String floorId) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(List.of());
    }
    
    @Operation(summary = "Update food card balance", description = "Update user's food card balance")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Balance updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid amount"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/{id}/food-card-balance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<UserDTO> updateFoodCardBalance(
            @Parameter(description = "User ID") @PathVariable Long id,
            @Parameter(description = "New balance amount") @RequestParam Double amount) {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok(new UserDTO());
    }
    
    @Operation(summary = "Get user statistics", description = "Get user statistics by role and floor")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<?> getUserStatistics() {
        // TODO: Implement when UserService is available
        return ResponseEntity.ok("{}");
    }
} 