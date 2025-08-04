package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.LoginRequest;
import com.atomix.cafeteria.dto.SignupRequest;
import com.atomix.cafeteria.dto.JwtResponse;
import com.atomix.cafeteria.dto.ApiResponse;
import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.repository.UserRepository;
import com.atomix.cafeteria.security.JwtUtils;
import com.atomix.cafeteria.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication V1", description = "Authentication management APIs v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthV1Controller {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Operation(summary = "Get current user", description = "Get current authenticated user information")
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return ResponseEntity.ok(userPrincipal);
    }

    @Operation(summary = "User login", description = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
            String refreshToken = jwtUtils.generateRefreshToken(userDetails.getEmail());

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, "Invalid credentials"));
        }
    }

    @Operation(summary = "User registration", description = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Email address already in use!"));
        }

        // Create new user account
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setPassword(encoder.encode(signupRequest.getPassword()));
        user.setRole(UserRole.EMPLOYEE); // Default role
        user.setFloorId(signupRequest.getFloorId());
        user.setDepartment(signupRequest.getDepartment());
        user.setEmployeeId(signupRequest.getEmployeeId());
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setFoodCardBalance(0.0); // Default balance

        User result = userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully"));
    }

    @Operation(summary = "Refresh token", description = "Refresh JWT token using refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        try {
            if (jwtUtils.validateJwtToken(refreshToken)) {
                String email = jwtUtils.getEmailFromJwtToken(refreshToken);
                String newToken = jwtUtils.generateTokenFromEmail(email);
                String newRefreshToken = jwtUtils.generateRefreshToken(email);

                User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

                return ResponseEntity.ok(new JwtResponse(
                    newToken,
                    newRefreshToken,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole().name()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, "Token refresh failed"));
        }
    }

    @Operation(summary = "Logout", description = "Logout user and invalidate token")
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse<>(true, "User logged out successfully"));
    }
} 