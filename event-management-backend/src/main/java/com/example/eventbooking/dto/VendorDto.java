package com.example.eventbooking.dto;

import lombok.Data;

@Data
public class VendorDto {
    private Integer id;
    private Integer userId;
    private String businessName;
    private String businessDesc;
    private String contactEmail;
    private String contactPhone;
    private String businessAddress;
    private String payoutMethod;
    private String payoutAccount;
    private Boolean isVerified;
}
