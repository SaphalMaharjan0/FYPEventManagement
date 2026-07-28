package com.example.eventbooking.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset your EventPulse password");

            String htmlContent = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f5f7; padding: 20px; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;\">" +
                "<div style=\"padding: 30px;\">" +
                "<h1 style=\"margin-top: 0; font-size: 24px; font-weight: bold; color: #0f172a;\">Reset your password</h1>" +
                "<p style=\"font-size: 16px; margin-bottom: 20px;\">Hello,</p>" +
                "<p style=\"font-size: 16px; line-height: 1.5; margin-bottom: 30px;\">" +
                "We received a request to reset your EventPulse account password. Click the button below to create a new password." +
                "</p>" +
                "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                "<a href=\"" + resetLink + "\" style=\"display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px;\">" +
                "Reset My Password" +
                "</a>" +
                "</div>" +
                "<p style=\"font-size: 14px; color: #64748b; margin-bottom: 10px;\">" +
                "If the button does not work, copy and paste this link into your browser:" +
                "</p>" +
                "<p style=\"font-size: 14px; word-break: break-all; margin-bottom: 30px;\">" +
                "<a href=\"" + resetLink + "\" style=\"color: #2563eb;\">" + resetLink + "</a>" +
                "</p>" +
                "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 14px; color: #475569;\">" +
                "This reset link will expire in <strong>30 minutes</strong>. If you did not request a password reset, you can safely ignore this email." +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            
            log.info("Password reset HTML email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
            log.warn("Mocking email send. Token for {}: {}", toEmail, token);
        }
    }

    public void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}", toEmail, e);
        }
    }
}
