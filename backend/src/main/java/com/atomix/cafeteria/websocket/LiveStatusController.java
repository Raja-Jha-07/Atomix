package com.atomix.cafeteria.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class LiveStatusController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/status.update")
    @SendTo("/topic/status")
    public Map<String, Object> updateStatus(Map<String, Object> statusUpdate) {
        // Add timestamp to the status update
        statusUpdate.put("timestamp", LocalDateTime.now().toString());
        return statusUpdate;
    }

    @MessageMapping("/crowd.update")
    @SendTo("/topic/crowd")
    public Map<String, Object> updateCrowdStatus(Map<String, Object> crowdUpdate) {
        // Process crowd update and broadcast to all subscribers
        crowdUpdate.put("timestamp", LocalDateTime.now().toString());
        return crowdUpdate;
    }

    @MessageMapping("/order.update")
    @SendTo("/topic/orders")
    public Map<String, Object> updateOrderStatus(Map<String, Object> orderUpdate) {
        // Process order update and broadcast
        orderUpdate.put("timestamp", LocalDateTime.now().toString());
        return orderUpdate;
    }

    // Method to send updates programmatically
    public void sendStatusUpdate(String floorId, Map<String, Object> status) {
        messagingTemplate.convertAndSend("/topic/status/" + floorId, status);
    }

    public void sendCrowdUpdate(String floorId, int currentCount, int maxCapacity) {
        Map<String, Object> update = Map.of(
            "floorId", floorId,
            "currentCount", currentCount,
            "maxCapacity", maxCapacity,
            "timestamp", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/crowd/" + floorId, update);
    }

    public void sendOrderUpdate(String userId, String orderId, String status) {
        Map<String, Object> update = Map.of(
            "orderId", orderId,
            "status", status,
            "timestamp", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSendToUser(userId, "/queue/orders", update);
    }
} 