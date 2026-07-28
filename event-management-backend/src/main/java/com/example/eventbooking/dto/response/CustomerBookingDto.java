package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerBookingDto {
    private Long id;
    private String bookingId;
    private String title;
    private String date;
    private String time;
    private String venue;
    private String image;
    private Integer tickets;
    private BigDecimal pricePaid;
    private String status;
}
