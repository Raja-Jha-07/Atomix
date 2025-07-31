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
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(authentication);
            String refreshToken = jwtUtils.generateRefreshToken(userPrincipal.getEmail());

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken,
                userPrincipal.getId(),
                userPrincipal.getEmail(),
                userPrincipal.getFirstName(),
                userPrincipal.getLastName(),
                userPrincipal.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid credentials"));
        }
    }

    @Operation(summary = "User registration", description = "Register a new user account")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Email address already in use!"));
        }

        // Create new user account
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(UserRole.valueOf(signupRequest.getRole().toUpperCase()));
        user.setFloorId(signupRequest.getFloorId());
        user.setDepartment(signupRequest.getDepartment());
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setEmployeeId(signupRequest.getEmployeeId());
        user.setIsActive(true);
        user.setEmailVerified(false); // Email verification can be implemented later

        User result = userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }

    @Operation(summary = "Get current user", description = "Get currently authenticated user information")
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return ResponseEntity.ok(userPrincipal);
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
                    .body(new ApiResponse(false, "Invalid refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Token refresh failed"));
        }
    }

    @Operation(summary = "Logout", description = "Logout user and invalidate token")
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse(true, "User logged out successfully"));
    }

    @Operation(summary = "OAuth2 Login", description = "Initiate OAuth2 login flow")
    @GetMapping("/oauth2/{provider}")
    public ResponseEntity<?> oauth2Login(@PathVariable String provider) {
        // This endpoint will be handled by Spring Security OAuth2
        // The actual OAuth2 flow will redirect to the provider
        return ResponseEntity.ok(new ApiResponse(true, "Redirecting to " + provider + " for authentication"));
    }
} 