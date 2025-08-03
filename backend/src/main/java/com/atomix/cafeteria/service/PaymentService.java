package com.atomix.cafeteria.service;

import com.atomix.cafeteria.dto.*;
import com.atomix.cafeteria.entity.*;
import com.atomix.cafeteria.repository.PaymentRepository;
import com.atomix.cafeteria.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    
    @Value("${app.payment.razorpay.key-id}")
    private String razorpayKeyId;
    
    @Value("${app.payment.razorpay.key-secret}")
    private String razorpayKeySecret;
    
    @Value("${app.payment.stripe.public-key}")
    private String stripePublicKey;
    
    @Value("${app.payment.stripe.secret-key}")
    private String stripeSecretKey;
    
    private RazorpayClient razorpayClient;
    
    public PaymentService(PaymentRepository paymentRepository, 
                         UserRepository userRepository, 
                         ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }
    
    private RazorpayClient getRazorpayClient() throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        }
        return razorpayClient;
    }
    
    private void initializeStripe() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    /**
     * Create a new payment order
     */
    public PaymentResponse createPayment(PaymentRequest request, Long userId) {
        logger.info("Creating payment for user: {} with amount: {}", userId, request.getAmount());
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate unique payment ID
        String paymentId = generatePaymentId();
        
        // Create payment entity
        com.atomix.cafeteria.entity.Payment payment = new com.atomix.cafeteria.entity.Payment(
            paymentId, user, request.getAmount(), request.getPaymentMethod(), request.getPaymentType()
        );
        payment.setDescription(request.getDescription());
        payment.setGatewayCurrency("INR");
        
        // Save payment
        payment = paymentRepository.save(payment);
        
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(paymentId);
        response.setAmount(request.getAmount());
        response.setPaymentMethod(request.getPaymentMethod());
        response.setPaymentStatus(PaymentStatus.PENDING);
        response.setPaymentType(request.getPaymentType());
        response.setCurrency("INR");
        response.setDescription(request.getDescription());
        response.setCreatedAt(payment.getCreatedAt());
        
        try {
            // Create gateway order based on payment method
            if (request.getPaymentMethod() == PaymentMethod.RAZORPAY) {
                createRazorpayOrder(payment, response);
            } else if (request.getPaymentMethod() == PaymentMethod.STRIPE) {
                createStripePaymentIntent(payment, response);
            } else if (request.getPaymentMethod() == PaymentMethod.FOOD_CARD) {
                // Handle food card payment immediately
                return processFoodCardPayment(payment, response);
            }
        } catch (Exception e) {
            logger.error("Error creating payment gateway order: ", e);
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            payment.setFailedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
            response.setPaymentStatus(PaymentStatus.FAILED);
            response.setFailureReason(e.getMessage());
        }
        
        return response;
    }
    
    private void createRazorpayOrder(com.atomix.cafeteria.entity.Payment payment, PaymentResponse response) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        
        // Convert amount to paise (Razorpay uses smallest currency unit)
        int amountInPaise = payment.getAmount().multiply(BigDecimal.valueOf(100)).intValue();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", payment.getPaymentId());
        
        Order order = client.orders.create(orderRequest);
        
        // Update payment with Razorpay order details
        payment.setGatewayOrderId(order.get("id"));
        payment.setGatewayReceipt(payment.getPaymentId());
        paymentRepository.save(payment);
        
        // Set response data for frontend
        response.setGatewayOrderId(order.get("id"));
        response.setRazorpayKeyId(razorpayKeyId);
        
        logger.info("Created Razorpay order: {} for payment: {}", order.get("id"), payment.getPaymentId());
    }
    
    private void createStripePaymentIntent(com.atomix.cafeteria.entity.Payment payment, PaymentResponse response) throws StripeException {
        initializeStripe();
        
        // Convert amount to paise (Stripe uses smallest currency unit)
        long amountInPaise = payment.getAmount().multiply(BigDecimal.valueOf(100)).longValue();
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amountInPaise)
            .setCurrency("inr")
            .putMetadata("payment_id", payment.getPaymentId())
            .putMetadata("user_id", payment.getUser().getId().toString())
            .build();
        
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        
        // Update payment with Stripe payment intent details
        payment.setGatewayPaymentId(paymentIntent.getId());
        payment.setGatewayOrderId(paymentIntent.getClientSecret());
        paymentRepository.save(payment);
        
        // Set response data for frontend
        response.setGatewayPaymentId(paymentIntent.getId());
        response.setClientSecret(paymentIntent.getClientSecret());
        response.setStripePublicKey(stripePublicKey);
        
        logger.info("Created Stripe PaymentIntent: {} for payment: {}", paymentIntent.getId(), payment.getPaymentId());
    }
    
    private PaymentResponse processFoodCardPayment(com.atomix.cafeteria.entity.Payment payment, PaymentResponse response) {
        User user = payment.getUser();
        
        if (payment.getPaymentType() == PaymentType.FOOD_CARD_TOPUP) {
            throw new RuntimeException("Cannot use food card for food card top-up");
        }
        
        // Check if user has sufficient balance
        BigDecimal currentBalance = BigDecimal.valueOf(user.getFoodCardBalance());
        if (currentBalance.compareTo(payment.getAmount()) < 0) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Insufficient food card balance");
            payment.setFailedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
            response.setPaymentStatus(PaymentStatus.FAILED);
            response.setFailureReason("Insufficient food card balance");
            return response;
        }
        
        // Deduct amount from food card balance
        user.setFoodCardBalance(currentBalance.subtract(payment.getAmount()).doubleValue());
        userRepository.save(user);
        
        // Mark payment as successful
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setProcessedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        
        response.setPaymentStatus(PaymentStatus.PAID);
        response.setProcessedAt(payment.getProcessedAt());
        
        logger.info("Processed food card payment: {} for user: {}", payment.getPaymentId(), user.getId());
        return response;
    }
    
    /**
     * Verify and process payment from gateway callback
     */
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        logger.info("Verifying payment: {}", request.getPaymentId());
        
        com.atomix.cafeteria.entity.Payment payment = paymentRepository.findByPaymentId(request.getPaymentId())
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        try {
            boolean verified = false;
            
            if (payment.getPaymentMethod() == PaymentMethod.RAZORPAY) {
                verified = verifyRazorpayPayment(request, payment);
            } else if (payment.getPaymentMethod() == PaymentMethod.STRIPE) {
                verified = verifyStripePayment(request, payment);
            }
            
            if (verified) {
                return processSuccessfulPayment(payment);
            } else {
                return markPaymentFailed(payment, "Payment verification failed");
            }
        } catch (Exception e) {
            logger.error("Error verifying payment: ", e);
            return markPaymentFailed(payment, e.getMessage());
        }
    }
    
    private boolean verifyRazorpayPayment(PaymentVerificationRequest request, com.atomix.cafeteria.entity.Payment payment) throws Exception {
        // Verify signature
        String signature = generateRazorpaySignature(request.getGatewayOrderId(), request.getGatewayPaymentId());
        
        if (!signature.equals(request.getGatewaySignature())) {
            logger.warn("Razorpay signature verification failed for payment: {}", payment.getPaymentId());
            return false;
        }
        
        // Fetch payment details from Razorpay
        RazorpayClient client = getRazorpayClient();
        Payment razorpayPayment = client.payments.fetch(request.getGatewayPaymentId());
        
        // Verify payment status and amount
        String status = razorpayPayment.get("status");
        int amountPaise = razorpayPayment.get("amount");
        BigDecimal amount = BigDecimal.valueOf(amountPaise).divide(BigDecimal.valueOf(100));
        
        if (!"captured".equals(status) || !amount.equals(payment.getAmount())) {
            logger.warn("Razorpay payment verification failed - status: {}, amount: {}", status, amount);
            return false;
        }
        
        // Update payment with gateway details
        payment.setGatewayPaymentId(request.getGatewayPaymentId());
        payment.setGatewaySignature(request.getGatewaySignature());
        
        return true;
    }
    
    private boolean verifyStripePayment(PaymentVerificationRequest request, com.atomix.cafeteria.entity.Payment payment) throws StripeException {
        initializeStripe();
        
        PaymentIntent paymentIntent = PaymentIntent.retrieve(request.getGatewayPaymentId());
        
        // Verify payment status and amount
        long amountPaise = paymentIntent.getAmount();
        BigDecimal amount = BigDecimal.valueOf(amountPaise).divide(BigDecimal.valueOf(100));
        
        if (!"succeeded".equals(paymentIntent.getStatus()) || !amount.equals(payment.getAmount())) {
            logger.warn("Stripe payment verification failed - status: {}, amount: {}", paymentIntent.getStatus(), amount);
            return false;
        }
        
        return true;
    }
    
    private PaymentResponse processSuccessfulPayment(com.atomix.cafeteria.entity.Payment payment) {
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setProcessedAt(LocalDateTime.now());
        
        // If this is a food card top-up, add amount to user's balance
        if (payment.getPaymentType() == PaymentType.FOOD_CARD_TOPUP) {
            User user = payment.getUser();
            BigDecimal currentBalance = BigDecimal.valueOf(user.getFoodCardBalance());
            user.setFoodCardBalance(currentBalance.add(payment.getAmount()).doubleValue());
            userRepository.save(user);
            logger.info("Added {} to food card balance for user: {}", payment.getAmount(), user.getId());
        }
        
        paymentRepository.save(payment);
        
        PaymentResponse response = modelMapper.map(payment, PaymentResponse.class);
        logger.info("Payment processed successfully: {}", payment.getPaymentId());
        
        return response;
    }
    
    private PaymentResponse markPaymentFailed(com.atomix.cafeteria.entity.Payment payment, String reason) {
        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason);
        payment.setFailedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        
        PaymentResponse response = modelMapper.map(payment, PaymentResponse.class);
        logger.warn("Payment marked as failed: {} - {}", payment.getPaymentId(), reason);
        
        return response;
    }
    
    /**
     * Get payment history for a user
     */
    public Page<PaymentHistoryResponse> getPaymentHistory(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Page<com.atomix.cafeteria.entity.Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        return payments.map(payment -> {
            PaymentHistoryResponse response = modelMapper.map(payment, PaymentHistoryResponse.class);
            if (payment.getOrder() != null) {
                response.setOrderNumber(payment.getOrder().getOrderNumber());
                // response.setVendorName(payment.getOrder().getVendor().getName()); // Uncomment when Vendor entity is complete
            }
            return response;
        });
    }
    
    /**
     * Get payment by ID
     */
    public PaymentResponse getPayment(String paymentId) {
        com.atomix.cafeteria.entity.Payment payment = paymentRepository.findByPaymentId(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        return modelMapper.map(payment, PaymentResponse.class);
    }
    
    /**
     * Get user's food card balance
     */
    public BigDecimal getFoodCardBalance(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return BigDecimal.valueOf(user.getFoodCardBalance());
    }
    
    // Utility methods
    private String generatePaymentId() {
        return "PAY_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }
    
    private String generateRazorpaySignature(String orderId, String paymentId) throws Exception {
        String payload = orderId + "|" + paymentId;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes());
        
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
} 