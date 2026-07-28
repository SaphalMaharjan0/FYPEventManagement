package com.example.eventbooking.dto.request;

import com.example.eventbooking.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private Role role; // Optional, defaults to CUSTOMER if not provided
}
