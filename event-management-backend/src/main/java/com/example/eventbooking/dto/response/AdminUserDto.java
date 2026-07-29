package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private Integer dbId;
    private String id; // format: "USR-001"
    private String name;
    private String email;
    private String role; // e.g. "Customer", "Vendor", "Admin"
    private String status; // e.g. "Active", "Inactive"
    private String joinedDate;
    private String password; // optional for updating
    @com.fasterxml.jackson.annotation.JsonProperty("isSuperAdmin")
    private Boolean isSuperAdmin;
}
