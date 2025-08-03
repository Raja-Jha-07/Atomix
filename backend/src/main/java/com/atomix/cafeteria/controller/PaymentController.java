package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.*;
import com.atomix.cafeteria.security.UserPrincipal;
import com.atomix.cafeteria.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payment Management", description = "APIs for payment processing with Razorpay/Stripe integration")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @Operation(summary = "Create payment order", description = "Create a new payment order for Razorpay/Stripe or process food card payment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment order created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid payment request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Payment gateway error")
    })
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @Parameter(description = "Payment request details") @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        PaymentResponse response = paymentService.createPayment(request, userPrincipal.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Verify payment", description = "Verify payment from gateway callback and update payment status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment verified successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid verification request"),
        @ApiResponse(responseCode = "404", description = "Payment not found"),
        @ApiResponse(responseCode = "500", description = "Verification error")
    })
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @Parameter(description = "Payment verification details") @Valid @RequestBody PaymentVerificationRequest request) {
        
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get payment details", description = "Get payment details by payment ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment details retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Payment not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('ADMIN') or @paymentSecurity.canAccessPayment(authentication, #paymentId)")
    public ResponseEntity<PaymentResponse> getPayment(
            @Parameter(description = "Payment ID") @PathVariable String paymentId) {
        
        PaymentResponse response = paymentService.getPayment(paymentId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get payment history", description = "Get paginated payment history for current user")
    @ApiResponse(responseCode = "200", description = "Payment history retrieved successfully")
    @GetMapping("/history")
    public ResponseEntity<Page<PaymentHistoryResponse>> getPaymentHistory(
            @Parameter(description = "Pagination information") Pageable pageable,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Page<PaymentHistoryResponse> history = paymentService.getPaymentHistory(userPrincipal.getId(), pageable);
        
        return ResponseEntity.ok(history);
    }
    
    @Operation(summary = "Get user payment history", description = "Get paginated payment history for specific user (Admin/Manager only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment history retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/history/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<Page<PaymentHistoryResponse>> getUserPaymentHistory(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Pagination information") Pageable pageable) {
        
        Page<PaymentHistoryResponse> history = paymentService.getPaymentHistory(userId, pageable);
        return ResponseEntity.ok(history);
    }
    
    @Operation(summary = "Top up food card", description = "Create payment order to top up user's food card balance")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Food card top-up order created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid top-up request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/topup")
    public ResponseEntity<PaymentResponse> topUpFoodCard(
            @Parameter(description = "Top-up amount and payment method") @Valid @RequestBody FoodCardTopUpRequest request,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Create payment request for food card top-up
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setAmount(request.getAmount());
        paymentRequest.setPaymentMethod(request.getPaymentMethod());
        paymentRequest.setPaymentType(com.atomix.cafeteria.entity.PaymentType.FOOD_CARD_TOPUP);
        paymentRequest.setDescription("Food Card Top-up - ₹" + request.getAmount());
        
        PaymentResponse response = paymentService.createPayment(paymentRequest, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get food card balance", description = "Get current user's food card balance")
    @ApiResponse(responseCode = "200", description = "Food card balance retrieved successfully")
    @GetMapping("/foodcard/balance")
    public ResponseEntity<FoodCardBalanceResponse> getFoodCardBalance(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        BigDecimal balance = paymentService.getFoodCardBalance(userPrincipal.getId());
        
        FoodCardBalanceResponse response = new FoodCardBalanceResponse();
        response.setBalance(balance);
        response.setUserId(userPrincipal.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get user food card balance", description = "Get specific user's food card balance (Admin/Manager only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Food card balance retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/foodcard/balance/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CAFETERIA_MANAGER')")
    public ResponseEntity<FoodCardBalanceResponse> getUserFoodCardBalance(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        
        BigDecimal balance = paymentService.getFoodCardBalance(userId);
        
        FoodCardBalanceResponse response = new FoodCardBalanceResponse();
        response.setBalance(balance);
        response.setUserId(userId);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Payment webhook", description = "Webhook endpoint for payment gateway callbacks")
    @ApiResponse(responseCode = "200", description = "Webhook processed successfully")
    @PostMapping("/webhook/{gateway}")
    public ResponseEntity<String> paymentWebhook(
            @Parameter(description = "Payment gateway (razorpay/stripe)") @PathVariable String gateway,
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        
        // TODO: Implement webhook processing for automatic payment verification
        // This would handle payment status updates from Razorpay/Stripe
        
        return ResponseEntity.ok("Webhook received");
    }
    
    @Operation(summary = "Health check", description = "Check payment gateway connectivity")
    @ApiResponse(responseCode = "200", description = "Payment gateways are healthy")
    @GetMapping("/health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentHealthResponse> healthCheck() {
        // TODO: Implement health check for payment gateways
        
        PaymentHealthResponse response = new PaymentHealthResponse();
        response.setRazorpayStatus("UP");
        response.setStripeStatus("UP");
        response.setTimestamp(java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
} 