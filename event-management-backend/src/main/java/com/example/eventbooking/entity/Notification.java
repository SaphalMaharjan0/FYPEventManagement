package com.example.eventbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipientUser;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    /** e.g. SERVICE_REJECTED, SERVICE_ACCEPTED, NEW_REQUEST, GENERAL */
    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "related_event_id")
    private Integer relatedEventId;

    @Column(name = "related_request_id")
    private Integer relatedRequestId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
