package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.dto.ApiResponse;
import com.atomix.cafeteria.dto.PaymentRequest;
import com.atomix.cafeteria.dto.PaymentVerificationRequest;
import com.atomix.cafeteria.entity.Payment;
import com.atomix.cafeteria.entity.PaymentType;
import com.atomix.cafeteria.service.PaymentService;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    /**
     * Create Razorpay order for food card recharge
     */
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            logger.info("Creating payment order for user {} with amount {}", 
                    userDetails.getUsername(), request.getAmount());
            
            JSONObject order = paymentService.createOrder(request, userDetails.getUsername(), PaymentType.FOOD_CARD_RECHARGE);
            
            Map<String, Object> response = new HashMap<>();
            response.put("order", order.toMap());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Order created successfully", response));
            
        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay order for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to create order: " + e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error creating order for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred", null));
        }
    }
    
    /**
     * Verify payment and update food card balance
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            logger.info("Verifying payment for user {} with order {}", 
                    userDetails.getUsername(), request.getOrderId());
            
            boolean isVerified = paymentService.verifyPayment(request, userDetails.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("verified", isVerified);
            response.put("paymentId", request.getPaymentId());
            response.put("orderId", request.getOrderId());
            
            if (isVerified) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Payment verified successfully", response));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Payment verification failed", response));
            }
            
        } catch (Exception e) {
            logger.error("Error verifying payment for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Payment verification failed: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get user's payment history
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String type) {
        
        try {
            List<Payment> payments;
            
            if (type != null && !type.isEmpty()) {
                PaymentType paymentType = PaymentType.valueOf(type.toUpperCase());
                payments = paymentService.getUserPaymentHistoryByType(userDetails.getUsername(), paymentType);
            } else {
                payments = paymentService.getUserPaymentHistory(userDetails.getUsername());
            }
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment history retrieved successfully", payments));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Invalid payment type: " + type, null));
        } catch (Exception e) {
            logger.error("Error retrieving payment history for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to retrieve payment history", null));
        }
    }
    
    /**
     * Create order for food order payment
     */
    @PostMapping("/create-order-payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrderPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            logger.info("Creating order payment for user {} with amount {}", 
                    userDetails.getUsername(), request.getAmount());
            
            JSONObject order = paymentService.createOrder(request, userDetails.getUsername(), PaymentType.ORDER_PAYMENT);
            
            Map<String, Object> response = new HashMap<>();
            response.put("order", order.toMap());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Order payment created successfully", response));
            
        } catch (RazorpayException e) {
            logger.error("Error creating order payment for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to create order payment: " + e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error creating order payment for user {}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred", null));
        }
    }
} 