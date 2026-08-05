package com.example.eventbooking.dto.request;

import lombok.Data;

@Data
public class KhaltiInitiateRequest {
    private Integer eventId;
    private Integer quantity;
}
