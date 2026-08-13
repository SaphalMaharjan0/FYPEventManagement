package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

import com.example.eventbooking.entity.Notification;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.repository.NotificationRepository;
import com.example.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    /**
     * Create and persist a notification for a specific user.
     * Also sends an email notification.
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
        Notification saved = notificationRepository.save(n);

        String htmlMsg = "<div style='font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);'>"
                + "<h2 style='color: #4CAF50; text-align: center;'>Event Booking Notification</h2>"
                + "<p style='font-size: 16px; color: #333; line-height: 1.6;'>" + message + "</p>"
                + "<hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>"
                + "<p style='font-size: 12px; color: #888; text-align: center;'>"
                + "This is an automated email from Event Booking System. Please do not reply."
                + "</p>"
                + "</div>"
                + "</div>";

        emailService.sendEmail(recipient.getEmail(), title, htmlMsg);

        return saved;
    }

    /**
     * Send the same notification to all administrator users, optionally excluding
     * one user.
     */
    public void notifyAllAdmins(String title, String message, String type,
            Integer relatedEventId, Integer relatedRequestId, User excludeUser) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "administrator".equalsIgnoreCase(u.getRole().name()))
                .toList();
        for (User admin : admins) {
            if (excludeUser != null && admin.getUserId().equals(excludeUser.getUserId())) {
                continue;
            }
            createNotification(admin, title, message, type, relatedEventId, relatedRequestId);
        }
    }

    /**
     * Send notification to all customers and vendors asynchronously.
     */
    @Async("taskExecutor")
    public void notifyAllCustomersAndVendors(String title, String message, String type, Integer relatedEventId) {
        List<User> targetUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && 
                    ("customer".equalsIgnoreCase(u.getRole().name()) || "vendor".equalsIgnoreCase(u.getRole().name())))
                .toList();
        
        for (User user : targetUsers) {
            createNotification(user, title, message, type, relatedEventId, null);
        }
    }

    /**
     * Get all notifications for the current user.
     */
    public List<Notification> getNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByRecipientUserUserIdOrderByCreatedAtDesc(user.getUserId());
    }

    /**
     * Get the count of unread notifications.
     */
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByRecipientUserUserIdAndIsReadFalse(user.getUserId());
    }

    /**
     * Mark a single notification as read.
     */
    public void markAsRead(Integer notificationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getRecipientUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("Unauthorized");
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsReadByUserId(user.getUserId());
    }
}
