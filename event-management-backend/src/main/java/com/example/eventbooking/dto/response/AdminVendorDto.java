package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminVendorDto {
    private Integer dbId;
    private String id;
    private String name;
    private String owner;
    private String email;
    private String status;
    private Integer properties;
    private String joined;
    
    // Additional business details
    private String businessDesc;
    private String contactEmail;
    private String contactPhone;
    private String businessAddress;
}
