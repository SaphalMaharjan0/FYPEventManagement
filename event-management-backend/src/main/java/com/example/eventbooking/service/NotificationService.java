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
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

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
        
        sendEmailAsync(recipient.getEmail(), title, message);
        
        return saved;
    }

    private void sendEmailAsync(String to, String subject, String text) {
        new Thread(() -> {
            try {
                jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, "utf-8");
                helper.setFrom("formod235@gmail.com");
                helper.setTo(to);
                helper.setSubject(subject);
                
                String htmlMsg = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>"
                               + "<div style='background-color: #0f172a; padding: 25px; text-align: center; color: white;'>"
                               + "<h2 style='margin: 0; font-size: 24px; font-weight: bold;'>" + subject + "</h2>"
                               + "</div>"
                               + "<div style='padding: 30px; background-color: #ffffff; color: #334155; line-height: 1.6;'>"
                               + "<p style='font-size: 16px; margin-top: 0;'>" + text + "</p>"
                               + "<p style='margin-top: 30px; font-size: 14px; color: #64748b;'>Log in to your dashboard to view more details.</p>"
                               + "</div>"
                               + "<div style='background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0;'>"
                               + "<p style='margin: 0;'>Event Booking Platform &copy; 2026</p>"
                               + "</div>"
                               + "</div>";
                               
                helper.setText(htmlMsg, true);
                mailSender.send(mimeMessage);
                System.out.println("HTML Email sent successfully to: " + to);
            } catch (Exception e) {
                System.err.println("Failed to send HTML email to " + to + ": " + e.getMessage());
            }
        }).start();
    }

    /**
     * Send the same notification to all administrator users, optionally excluding one user.
     */
    public void notifyAllAdmins(String title, String message, String type,
                                Integer relatedEventId, Integer relatedRequestId, User excludeUser) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "administrator".equalsIgnoreCase(u.getRole().name()))
                .toList();
        for (User admin : admins) {
            if (excludeUser != null && admin.getUserId().equals(excludeUser.getUserId())) {
                continue;
            }
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
