package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminEventDto {
    private Integer dbId;
    private String id;
    private String name;
    private String category;
    private String date;
    private String venue;
    private String imageUrl;
    private String price;
    private String seats; // e.g. "124/500"
    private Double rating;
    private String description;
    private String startTime;
    private String endTime;
    private String status;
    private java.util.List<Integer> serviceIds;
}
