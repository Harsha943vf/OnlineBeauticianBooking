package com.beautician.bookingsystem.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@example.com}")
    private String fromEmail;

    @Async
    public void sendBookingConfirmation(String toEmail, String clientName,
            String beauticianName, String serviceName, String date, String time) {
        String subject = "Booking Confirmed - BeautyBook";
        String body = String.format("""
                Hi %s,

                Your booking has been confirmed!

                Details:
                - Beautician: %s
                - Service: %s
                - Date: %s
                - Time: %s

                Thank you for choosing BeautyBook!

                Best regards,
                BeautyBook Team
                """, clientName, beauticianName, serviceName, date, time);

        sendEmail(toEmail, subject, body);
    }

    @Async
    public void sendBookingCancellation(String toEmail, String clientName,
            String serviceName, String date, String time, String reason) {
        String subject = "Booking Cancelled - BeautyBook";
        String body = String.format("""
                Hi %s,

                Your booking has been cancelled.

                Details:
                - Service: %s
                - Date: %s
                - Time: %s
                - Reason: %s

                If this was a mistake, please book again through our platform.

                Best regards,
                BeautyBook Team
                """, clientName, serviceName, date, time, reason != null ? reason : "N/A");

        sendEmail(toEmail, subject, body);
    }

    @Async
    public void sendBookingStatusUpdate(String toEmail, String clientName,
            String serviceName, String status) {
        String subject = "Booking " + status + " - BeautyBook";
        String body = String.format("""
                Hi %s,

                Your booking for "%s" has been %s.

                Best regards,
                BeautyBook Team
                """, clientName, serviceName, status.toLowerCase());

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            log.warn("Mail sender not configured, skipping email to {}", to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
