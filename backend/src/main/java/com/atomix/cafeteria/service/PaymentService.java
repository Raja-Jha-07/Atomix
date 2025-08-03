package com.atomix.cafeteria.service;

import com.atomix.cafeteria.dto.PaymentRequest;
import com.atomix.cafeteria.dto.PaymentVerificationRequest;
import com.atomix.cafeteria.entity.Payment;
import com.atomix.cafeteria.entity.PaymentStatus;
import com.atomix.cafeteria.entity.PaymentType;
import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.repository.PaymentRepository;
import com.atomix.cafeteria.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;
    private final String razorpayKeySecret;
    
    public PaymentService(
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            @Value("${razorpay.key-id}") String razorpayKeyId,
            @Value("${razorpay.key-secret}") String razorpayKeySecret) throws RazorpayException {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.razorpayKeySecret = razorpayKeySecret;
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }
    
    /**
     * Create Razorpay order for payment
     */
    public JSONObject createOrder(PaymentRequest request, String userEmail, PaymentType paymentType) throws RazorpayException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        
        // Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount()); // Amount in paise
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", generateReceiptNumber());
        
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        
        // Save payment record
        Payment payment = new Payment(
                razorpayOrder.get("id"),
                user,
                new BigDecimal(request.getAmount()).divide(new BigDecimal(100)), // Convert paise to rupees
                request.getCurrency(),
                request.getDescription(),
                paymentType
        );
        payment.setReceiptNumber(orderRequest.getString("receipt"));
        payment.setStatus(PaymentStatus.CREATED);
        
        paymentRepository.save(payment);
        
        logger.info("Created Razorpay order {} for user {} with amount {}", 
                razorpayOrder.get("id"), userEmail, request.getAmount());
        
        return razorpayOrder.toJson();
    }
    
    /**
     * Verify payment signature and update payment status
     */
    public boolean verifyPayment(PaymentVerificationRequest request, String userEmail) {
        try {
            // Verify signature
            String generatedSignature = generateSignature(request.getOrderId(), request.getPaymentId());
            
            if (!generatedSignature.equals(request.getSignature())) {
                logger.warn("Payment signature verification failed for order {}", request.getOrderId());
                updatePaymentStatus(request.getOrderId(), PaymentStatus.FAILED);
                return false;
            }
            
            // Find payment record
            Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(request.getOrderId());
            if (paymentOpt.isEmpty()) {
                logger.warn("Payment record not found for order {}", request.getOrderId());
                return false;
            }
            
            Payment payment = paymentOpt.get();
            
            // Verify user
            if (!payment.getUser().getEmail().equals(userEmail)) {
                logger.warn("User mismatch for payment verification. Expected: {}, Actual: {}", 
                        payment.getUser().getEmail(), userEmail);
                return false;
            }
            
            // Update payment record
            payment.setRazorpayPaymentId(request.getPaymentId());
            payment.setRazorpaySignature(request.getSignature());
            payment.setStatus(PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
            
            // Handle payment completion based on type
            handlePaymentCompletion(payment);
            
            logger.info("Payment verification successful for order {} by user {}", 
                    request.getOrderId(), userEmail);
            
            return true;
            
        } catch (Exception e) {
            logger.error("Error verifying payment for order {}: {}", request.getOrderId(), e.getMessage());
            updatePaymentStatus(request.getOrderId(), PaymentStatus.FAILED);
            return false;
        }
    }
    
    /**
     * Handle payment completion based on payment type
     */
    private void handlePaymentCompletion(Payment payment) {
        if (payment.getType() == PaymentType.FOOD_CARD_RECHARGE) {
            // Update user's food card balance
            User user = payment.getUser();
            BigDecimal currentBalance = user.getFoodCardBalance() != null ? 
                    new BigDecimal(user.getFoodCardBalance().toString()) : BigDecimal.ZERO;
            BigDecimal newBalance = currentBalance.add(payment.getAmount());
            user.setFoodCardBalance(newBalance.doubleValue());
            userRepository.save(user);
            
            logger.info("Updated food card balance for user {} to {}", 
                    user.getEmail(), newBalance);
        }
        // Add more payment type handling as needed
    }
    
    /**
     * Generate HMAC SHA256 signature for payment verification
     */
    private String generateSignature(String orderId, String paymentId) throws NoSuchAlgorithmException, InvalidKeyException {
        String payload = orderId + "|" + paymentId;
        
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        
        return hexString.toString();
    }
    
    /**
     * Update payment status
     */
    private void updatePaymentStatus(String orderId, PaymentStatus status) {
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
            payment.setStatus(status);
            paymentRepository.save(payment);
        });
    }
    
    /**
     * Generate unique receipt number
     */
    private String generateReceiptNumber() {
        return "ATOMIX_" + System.currentTimeMillis();
    }
    
    /**
     * Get user's payment history
     */
    public List<Payment> getUserPaymentHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        return paymentRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get user's payment history by type
     */
    public List<Payment> getUserPaymentHistoryByType(String userEmail, PaymentType type) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        return paymentRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type);
    }
} 