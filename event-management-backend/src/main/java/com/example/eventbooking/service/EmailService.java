package com.example.eventbooking.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Booking;
import com.example.eventbooking.entity.Event;

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

    public void sendBookingConfirmation(User customer, Booking booking, Event event) {
        String subject = "Booking Confirmed - " + event.getTitle();
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f5f7; padding: 20px; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;\">" +
                "<div style=\"padding: 30px;\">" +
                "<h1 style=\"margin-top: 0; font-size: 24px; font-weight: bold; color: #22c55e;\">Booking Confirmed!</h1>" +
                "<p style=\"font-size: 16px; margin-bottom: 20px;\">Dear " + customer.getFullName() + ",</p>" +
                "<p style=\"font-size: 16px; line-height: 1.5; margin-bottom: 30px;\">" +
                "Thank you for your purchase. Your booking is confirmed. Here are your ticket details:" +
                "</p>" +
                "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-size: 16px; color: #0f172a; margin-bottom: 30px;\">" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Event:</strong> " + event.getTitle() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Date & Time:</strong> " + event.getEventDate() + " @ " + event.getStartTime() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Venue:</strong> " + event.getVenue() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Tickets:</strong> " + booking.getTicketCount() + "</p>" +
                "<p style=\"margin: 0;\"><strong>Amount Paid:</strong> Rs. " + booking.getAmount() + "</p>" +
                "</div>" +
                "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                "<p style=\"font-size: 14px; color: #64748b; margin-bottom: 10px;\">Booking reference ID:</p>" +
                "<p style=\"font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #0f172a;\">" + com.example.eventbooking.service.CustomerService.generateTicketCode(booking.getId()) + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

        sendEmail(customer.getEmail(), subject, htmlContent);
    }

    public void sendAdminBookingAlert(User admin, User customer, Booking booking, Event event) {
        String subject = "New Booking Notification - EventPulse";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f5f7; padding: 20px; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;\">" +
                "<div style=\"padding: 30px;\">" +
                "<h1 style=\"margin-top: 0; font-size: 22px; font-weight: bold; color: #0f172a;\">New Booking Received</h1>" +
                "<p style=\"font-size: 16px; margin-bottom: 20px;\">Hello Admin (" + admin.getFullName() + "),</p>" +
                "<p style=\"font-size: 16px; line-height: 1.5; margin-bottom: 30px;\">" +
                "A new booking has been made on the platform. Details below:" +
                "</p>" +
                "<h3>Customer Details</h3>" +
                "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 15px; color: #0f172a; margin-bottom: 20px;\">" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Name:</strong> " + customer.getFullName() + "</p>" +
                "<p style=\"margin: 0;\"><strong>Email:</strong> " + customer.getEmail() + "</p>" +
                "</div>" +
                "<h3>Booking & Payment Details</h3>" +
                "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 15px; color: #0f172a; margin-bottom: 20px;\">" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Booking ID:</strong> " + com.example.eventbooking.service.CustomerService.generateTicketCode(booking.getId()) + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Event:</strong> " + event.getTitle() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Ticket Count:</strong> " + booking.getTicketCount() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Total Paid:</strong> Rs. " + booking.getAmount() + "</p>" +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Payment Method:</strong> " + booking.getPaymentMethod() + "</p>" +
                "<p style=\"margin: 0;\"><strong>Transaction Ref:</strong> " + booking.getTransactionUuid() + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

        sendEmail(admin.getEmail(), subject, htmlContent);
    }
}
