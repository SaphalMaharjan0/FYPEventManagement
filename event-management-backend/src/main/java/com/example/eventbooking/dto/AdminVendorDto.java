package com.example.eventbooking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminVendorDto {
    private String id;
    private String name;
    private String owner;
    private String email;
    private String status;
    private Integer properties;
    private String joined;
}
