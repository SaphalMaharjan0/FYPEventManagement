package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.*;
import com.example.eventbooking.dto.response.*;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(adminService.getDashboardStats(currentUser));
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(adminService.getAllUsers(currentUser));
    }

    @GetMapping("/events")
    public ResponseEntity<List<AdminEventDto>> getAllEvents(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(adminService.getAllEvents(currentUser));
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<AdminVendorDto>> getAllVendors(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(adminService.getAllVendors(currentUser));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<AdminBookingDto>> getAllBookings(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(adminService.getAllBookings(currentUser));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> updateUser(@AuthenticationPrincipal User currentUser, @PathVariable Integer id, @RequestBody AdminUserDto dto) {
        return ResponseEntity.ok(adminService.updateUser(currentUser, id, dto));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<AdminEventDto> updateEvent(@AuthenticationPrincipal User currentUser, @PathVariable Integer id, @RequestBody AdminEventDto dto) {
        return ResponseEntity.ok(adminService.updateEvent(currentUser, id, dto));
    }

    @PostMapping("/events")
    public ResponseEntity<AdminEventDto> createEvent(@AuthenticationPrincipal User currentUser, @RequestBody AdminEventDto dto) {
        return ResponseEntity.ok(adminService.createEvent(currentUser, dto));
    }

    @PostMapping("/users")
    public ResponseEntity<AdminUserDto> createUser(@AuthenticationPrincipal User currentUser, @RequestBody AdminUserDto dto) {
        return ResponseEntity.ok(adminService.createUser(currentUser, dto));
    }

    @PostMapping("/vendors/invite")
    public ResponseEntity<AdminVendorDto> inviteVendor(@AuthenticationPrincipal User currentUser, @RequestBody AdminVendorInviteDto dto) {
        return ResponseEntity.ok(adminService.inviteVendor(currentUser, dto));
    }

    @PutMapping("/vendors/{id}")
    public ResponseEntity<AdminVendorDto> updateVendor(@AuthenticationPrincipal User currentUser, @PathVariable Integer id, @RequestBody AdminVendorDto dto) {
        return ResponseEntity.ok(adminService.updateVendor(currentUser, id, dto));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/vendors/{id}")
    public ResponseEntity<Void> deleteVendor(@AuthenticationPrincipal User currentUser, @PathVariable Integer id) {
        adminService.deleteVendor(currentUser, id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@AuthenticationPrincipal User currentUser, @PathVariable Integer id) {
        adminService.deleteEvent(currentUser, id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal User currentUser, @PathVariable Integer id) {
        adminService.deleteUser(currentUser, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllAvailableServices() {
        return ResponseEntity.ok(adminService.getAllAvailableServices());
    }
}
