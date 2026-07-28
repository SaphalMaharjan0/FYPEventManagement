package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VendorDashboardStatsDto {

    private long totalServices;
    private long pendingRequests;
    private long activeRequests;
    private BigDecimal totalRevenue;

    private List<RecentRequestDto> recentRequests;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentRequestDto {
        private String id;
        private String client;
        private String service;
        private String eventDate;
        private BigDecimal amount;
        private String status;
    }
}
