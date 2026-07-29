package com.example.eventbooking.controller;

import com.example.eventbooking.entity.Notification;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(@AuthenticationPrincipal User user) {
        List<Notification> notifications = notificationService.getNotifications(user.getEmail());
        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", n.getId());
            map.put("title", n.getTitle());
            map.put("message", n.getMessage());
            map.put("type", n.getType());
            map.put("isRead", n.isRead());
            map.put("relatedEventId", n.getRelatedEventId());
            map.put("relatedRequestId", n.getRelatedRequestId());
            map.put("createdAt", n.getCreatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        long count = notificationService.getUnreadCount(user.getEmail());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@AuthenticationPrincipal User user, @PathVariable Integer id) {
        notificationService.markAsRead(id, user.getEmail());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getEmail());
        return ResponseEntity.ok().build();
    }
}
