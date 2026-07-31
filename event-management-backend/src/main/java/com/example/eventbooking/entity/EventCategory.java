package com.example.eventbooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;
}
