package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.*;
import com.example.eventbooking.dto.response.*;
import com.example.eventbooking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/events")
    public ResponseEntity<List<AdminEventDto>> getAllEvents() {
        return ResponseEntity.ok(adminService.getAllEvents());
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<AdminVendorDto>> getAllVendors() {
        return ResponseEntity.ok(adminService.getAllVendors());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<AdminBookingDto>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> updateUser(@PathVariable Integer id, @RequestBody AdminUserDto dto) {
        return ResponseEntity.ok(adminService.updateUser(id, dto));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<AdminEventDto> updateEvent(@PathVariable Integer id, @RequestBody AdminEventDto dto) {
        return ResponseEntity.ok(adminService.updateEvent(id, dto));
    }

    @PostMapping("/events")
    public ResponseEntity<AdminEventDto> createEvent(@RequestBody AdminEventDto dto) {
        return ResponseEntity.ok(adminService.createEvent(dto));
    }

    @PostMapping("/users")
    public ResponseEntity<AdminUserDto> createUser(@RequestBody AdminUserDto dto) {
        return ResponseEntity.ok(adminService.createUser(dto));
    }

    @PostMapping("/vendors/invite")
    public ResponseEntity<AdminVendorDto> inviteVendor(@RequestBody AdminVendorInviteDto dto) {
        return ResponseEntity.ok(adminService.inviteVendor(dto));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer id) {
        adminService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
