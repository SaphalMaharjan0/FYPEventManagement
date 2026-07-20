package com.example.eventbooking.dto;

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
    
    @Data
    @Builder
    public static class ChartData {
        private String name;
        private Number value;
    }
}
