package com.example.eventbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "vendor_blocked_dates")
public class VendorBlockedDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "blocked_date", nullable = false)
    private LocalDate blockedDate;

    @Column(name = "reason", length = 255)
    private String reason;
}
