package com.example.eventbooking.dto.request;

import lombok.Data;

@Data
public class EsewaInitiateRequest {
    private Integer eventId;
    private Integer quantity;
}
