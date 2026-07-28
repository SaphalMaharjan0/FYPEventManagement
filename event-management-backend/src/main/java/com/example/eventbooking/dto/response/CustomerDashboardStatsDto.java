package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardStatsDto {
    private long totalBookings;
    private long upcomingEventsCount;
    private long favoritesCount;
    private BigDecimal amountSpent;
    
    private List<EventDto> upcomingEvents;
    private List<ActivityDto> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventDto {
        private Long id;
        private String title;
        private String date;
        private String venue;
        private String image;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityDto {
        private String id;
        private String type; // "booking", "favorite", "review"
        private String description;
        private String timeAgo;
    }
}
