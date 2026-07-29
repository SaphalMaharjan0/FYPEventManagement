package com.example.eventbooking.service;

import com.example.eventbooking.entity.Notification;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.repository.NotificationRepository;
import com.example.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Create and persist a notification for a specific user.
     */
    public Notification createNotification(User recipient, String title, String message, String type,
                                           Integer relatedEventId, Integer relatedRequestId) {
        Notification n = new Notification();
        n.setRecipientUser(recipient);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setRelatedEventId(relatedEventId);
        n.setRelatedRequestId(relatedRequestId);
        return notificationRepository.save(n);
    }

    /**
     * Send the same notification to all administrator users.
     */
    public void notifyAllAdmins(String title, String message, String type,
                                Integer relatedEventId, Integer relatedRequestId) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "administrator".equalsIgnoreCase(u.getRole().name()))
                .toList();
        for (User admin : admins) {
            createNotification(admin, title, message, type, relatedEventId, relatedRequestId);
        }
    }

    /**
     * Get all notifications for the current user.
     */
    public List<Notification> getNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientUserUserIdOrderByCreatedAtDesc(user.getUserId());
    }

    /**
     * Get the count of unread notifications.
     */
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByRecipientUserUserIdAndIsReadFalse(user.getUserId());
    }

    /**
     * Mark a single notification as read.
     */
    public void markAsRead(Integer notificationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getRecipientUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    /**
     * Mark all notifications as read for the current user.
     */
    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.markAllAsReadByUserId(user.getUserId());
    }
}
