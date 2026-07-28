package com.example.eventbooking.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VendorBlockedDateDto {
    private Integer id;
    private LocalDate blockedDate;
    private String reason;
}
