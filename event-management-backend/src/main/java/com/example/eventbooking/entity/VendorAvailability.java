package com.example.eventbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "vendor_availability")
public class VendorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime = LocalTime.of(9, 0);

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime = LocalTime.of(17, 0);
}
