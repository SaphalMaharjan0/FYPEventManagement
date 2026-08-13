package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private String profilePicture;
    private String citizenshipImage;
    private String passportPhoto;
    private String panVatImage;
}
