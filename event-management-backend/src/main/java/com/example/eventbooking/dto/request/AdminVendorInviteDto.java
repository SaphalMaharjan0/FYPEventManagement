package com.example.eventbooking.dto.request;

import lombok.Data;

@Data
public class AdminVendorInviteDto {
    private String email;
    private String fullName;
    private String businessName;
}
