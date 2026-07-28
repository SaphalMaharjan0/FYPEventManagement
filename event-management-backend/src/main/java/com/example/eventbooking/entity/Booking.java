package com.example.eventbooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private Integer ticketCount;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String status; // e.g., "Confirmed", "Pending", "Cancelled"

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(unique = true)
    private String transactionUuid;

    @Column
    private String paymentMethod;
}
