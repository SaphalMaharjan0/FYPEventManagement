package com.example.eventbooking.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class VendorScheduleDto {
    private List<VendorAvailabilityDto> availability;
    private List<VendorBlockedDateDto> blockedDates;
}
