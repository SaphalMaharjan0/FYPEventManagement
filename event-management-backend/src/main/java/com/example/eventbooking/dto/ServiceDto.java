package com.example.eventbooking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceDto {
    private Integer id;
    private Integer vendorId;
    private String serviceName;
    private String description;
    private String category;
    private BigDecimal price;
    private Boolean isActive;
}
