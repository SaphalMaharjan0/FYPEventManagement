package com.example.eventbooking.dto.response;

import lombok.Data;
import java.time.LocalTime;

@Data
public class VendorAvailabilityDto {
    private Integer id;
    private String dayOfWeek;
    private Boolean isAvailable;
    private LocalTime startTime;
    private String startTimeStr; // formatted time, optional helper
    private LocalTime endTime;
    private String endTimeStr; // formatted time, optional helper
}
