package com.example.eventbooking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminBookingDto {
    private String id;
    private String user;
    private String event;
    private String amount;
    private Integer tickets;
    private String date;
    private String status;
}
