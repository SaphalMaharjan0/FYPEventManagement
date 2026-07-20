package com.example.eventbooking.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String token) {
        // Construct the reset link (assuming frontend runs on localhost:5173 for now)
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("EventPulse - Password Reset Request");
        message.setText("Hello,\n\n" +
                "You have requested to reset your password. Please click the link below to set a new password:\n\n" +
                resetLink + "\n\n" +
                "This link will expire in 30 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Thanks,\nEventPulse Team");

        try {
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
            // In a real application, you might throw a custom exception here
            // But for development without real SMTP, we'll just log it so it doesn't crash the API.
            log.warn("Mocking email send. Token for {}: {}", toEmail, token);
        }
    }
}
