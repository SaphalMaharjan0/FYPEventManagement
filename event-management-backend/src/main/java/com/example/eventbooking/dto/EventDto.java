package com.example.eventbooking.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDto {
    private Integer id;
    private String title;
    private String category;
    private String date;
    private String time;
    private String venue;
    private Double price;
    private String image;
    private String organizer;
    private Integer totalSeats;
    private Integer seatsLeft;
    private Integer percentAvailable;
    private Boolean featured;
    private String description;
}
