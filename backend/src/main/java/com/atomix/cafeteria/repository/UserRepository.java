package com.atomix.cafeteria.repository;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmployeeId(String employeeId);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByFloorId(String floorId);
    
    List<User> findByDepartment(String department);
    
    List<User> findByIsActiveTrue();
    
    List<User> findByRoleAndIsActiveTrue(UserRole role);
    
    List<User> findByFloorIdAndIsActiveTrue(String floorId);
    
    Page<User> findByRoleOrderByCreatedAtDesc(UserRole role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<User> searchActiveUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    long countByRoleAndIsActiveTrue(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.floorId = :floorId AND u.isActive = true")
    long countByFloorIdAndIsActiveTrue(@Param("floorId") String floorId);
    
    // OAuth2 related methods
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    
    // Food card related methods
    @Query("SELECT u FROM User u WHERE u.foodCardBalance > 0 AND u.isActive = true")
    List<User> findUsersWithPositiveFoodCardBalance();
    
    @Query("SELECT SUM(u.foodCardBalance) FROM User u WHERE u.isActive = true")
    Double getTotalFoodCardBalance();
} 