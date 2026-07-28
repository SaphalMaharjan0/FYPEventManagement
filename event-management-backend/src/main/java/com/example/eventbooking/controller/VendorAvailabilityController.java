package com.example.eventbooking.controller;

import com.example.eventbooking.dto.response.VendorBlockedDateDto;
import com.example.eventbooking.dto.response.VendorScheduleDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.VendorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/vendor/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('VENDOR')")
public class VendorAvailabilityController {

    private final VendorAvailabilityService availabilityService;

    @GetMapping
    public ResponseEntity<VendorScheduleDto> getSchedule(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(availabilityService.getSchedule(currentUser.getEmail()));
    }

    @PutMapping
    public ResponseEntity<VendorScheduleDto> updateSchedule(
            @AuthenticationPrincipal User currentUser,
            @RequestBody VendorScheduleDto dto) {
        return ResponseEntity.ok(availabilityService.updateSchedule(currentUser.getEmail(), dto));
    }

    @PostMapping("/blocked")
    public ResponseEntity<VendorBlockedDateDto> addBlockedDate(
            @AuthenticationPrincipal User currentUser,
            @RequestBody VendorBlockedDateDto dto) {
        return ResponseEntity.ok(availabilityService.addBlockedDate(currentUser.getEmail(), dto));
    }

    @DeleteMapping("/blocked/{date}")
    public ResponseEntity<Void> deleteBlockedDate(
            @AuthenticationPrincipal User currentUser,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        availabilityService.deleteBlockedDate(currentUser.getEmail(), date);
        return ResponseEntity.noContent().build();
    }
}
