package com.example.eventbooking.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServiceRequestDto {
    private String id; // Format like REQ-001 for frontend display
    private Integer rawId;
    private String client;
    private String eventTitle;
    private String service;
    private LocalDate date;
    private BigDecimal amount;
    private String status;
    private EventDto eventDetails;
}
