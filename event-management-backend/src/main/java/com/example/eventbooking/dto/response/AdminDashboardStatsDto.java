package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long totalEvents;
    private long totalBookings;
    private BigDecimal totalRevenue;
    
    // Minimal nested classes for charts
    private List<ChartData> monthlyRevenue;
    private List<ChartData> eventsByCategory;
    private List<ChartData> userGrowthData;
    private List<ActivityDto> recentActivity;
    private List<ChartData> bookingsByDate;
    private List<TopEventDto> topEvents;
    
    @Data
    @Builder
    public static class ChartData {
        private String name;
        private Number value;
        private String color; // Added for category chart
    }

    @Data
    @Builder
    public static class TopEventDto {
        private Integer id;
        private String name;
        private BigDecimal revenue;
        private Double percentage;
    }

    @Data
    @Builder
    public static class ActivityDto {
        private String id;
        private String type; // "user", "event", "booking"
        private String description;
        private String timeAgo;
    }
}
