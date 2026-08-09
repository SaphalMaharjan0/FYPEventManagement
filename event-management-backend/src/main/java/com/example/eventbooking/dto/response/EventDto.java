package com.example.eventbooking.dto.response;

import lombok.*;
import java.time.LocalDate;

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
    private String imageUrl;
    private Double price;
    private String currency;
    private String image;
    private String organizer;
    private Integer totalSeats;
    private Integer seatsLeft;
    private Integer percentAvailable;
    private Boolean featured;
    private String description;
}
