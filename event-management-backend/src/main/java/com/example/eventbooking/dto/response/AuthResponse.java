package com.example.eventbooking.dto.response;

import com.example.eventbooking.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private Integer userId;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private Role role;
        private boolean isSuperAdmin;
    }
}
