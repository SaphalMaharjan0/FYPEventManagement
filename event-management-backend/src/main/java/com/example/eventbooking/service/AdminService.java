package com.example.eventbooking.service;

import com.example.eventbooking.dto.*;
import com.example.eventbooking.entity.Booking;
import com.example.eventbooking.entity.Event;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.entity.Role;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.eventbooking.entity.enums.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalBookings = bookingRepository.count();
        
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Dummy data for charts for now, could be aggregated from DB later
        List<AdminDashboardStatsDto.ChartData> monthlyRevenue = List.of(
                AdminDashboardStatsDto.ChartData.builder().name("Jan").value(45000).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Feb").value(58000).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Mar").value(51000).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Apr").value(72000).build()
        );

        List<AdminDashboardStatsDto.ChartData> eventsByCategory = List.of(
                AdminDashboardStatsDto.ChartData.builder().name("Technology").value(35).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Music").value(25).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Arts").value(20).build(),
                AdminDashboardStatsDto.ChartData.builder().name("Food").value(15).build()
        );

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .eventsByCategory(eventsByCategory)
                .build();
    }

    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> AdminUserDto.builder()
                        .dbId(user.getUserId())
                        .id("USR-" + String.format("%03d", user.getUserId()))
                        .name(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole() != null ? user.getRole().name() : "customer")
                        .status("Active") // Defaulting for now
                        .joinedDate(user.getCreatedAt() != null ? user.getCreatedAt().format(FORMATTER) : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminEventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> AdminEventDto.builder()
                        .dbId(event.getEventId())
                        .id("EVT-" + String.format("%03d", event.getEventId()))
                        .name(event.getTitle())
                        .category(event.getCategory())
                        .date(event.getEventDate() != null ? event.getEventDate().toString() : "N/A")
                        .venue(event.getVenue())
                        .price("Free") // Defaulting for now
                        .seats("0/" + event.getCapacity())
                        .rating(4.5) // Defaulting for now
                        .description(event.getDescription())
                        .startTime(event.getStartTime() != null ? event.getStartTime().toString() : null)
                        .endTime(event.getEndTime() != null ? event.getEndTime().toString() : null)
                        .status(event.getStatus() != null ? event.getStatus().name() : null)
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminVendorDto> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(vendor -> AdminVendorDto.builder()
                        .id("VND-" + String.format("%03d", vendor.getId()))
                        .name(vendor.getBusinessName())
                        .owner(vendor.getUser().getFullName())
                        .email(vendor.getUser().getEmail())
                        .status(vendor.getIsVerified() != null && vendor.getIsVerified() ? "Verified" : "Pending")
                        .properties(0)
                        .joined(vendor.getCreatedAt() != null ? vendor.getCreatedAt().format(FORMATTER) : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminBookingDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(booking -> AdminBookingDto.builder()
                        .id("BKG-" + String.format("%04d", booking.getId()))
                        .user(booking.getUser().getFullName())
                        .event(booking.getEvent().getTitle())
                        .amount("$" + booking.getAmount().toString())
                        .tickets(booking.getTicketCount())
                        .date(booking.getBookingDate() != null ? booking.getBookingDate().format(FORMATTER) : "N/A")
                        .status(booking.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public AdminUserDto updateUser(Integer id, AdminUserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getRole() != null) {
            try {
                user.setRole(Role.valueOf(dto.getRole()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid role
            }
        }
        if (dto.getStatus() != null) {
            user.setActive("Active".equalsIgnoreCase(dto.getStatus()));
        }
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }
        user = userRepository.save(user);
        return AdminUserDto.builder()
                .dbId(user.getUserId())
                .id("USR-" + String.format("%03d", user.getUserId()))
                .name(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "customer")
                .status(user.isActive() ? "Active" : "Inactive")
                .joinedDate(user.getCreatedAt() != null ? user.getCreatedAt().format(FORMATTER) : "N/A")
                .build();
    }

    public AdminEventDto updateEvent(Integer id, AdminEventDto dto) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(dto.getName());
        event.setCategory(dto.getCategory());
        event.setVenue(dto.getVenue());
        if (dto.getDescription() != null) {
            event.setDescription(dto.getDescription());
        }
        if (dto.getDate() != null && !dto.getDate().equals("N/A")) {
            try {
                event.setEventDate(LocalDate.parse(dto.getDate()));
            } catch (Exception e) {
                // Ignore invalid date
            }
        }
        if (dto.getStartTime() != null && !dto.getStartTime().isEmpty()) {
            try {
                event.setStartTime(LocalTime.parse(dto.getStartTime()));
            } catch (Exception e) {}
        }
        if (dto.getEndTime() != null && !dto.getEndTime().isEmpty()) {
            try {
                event.setEndTime(LocalTime.parse(dto.getEndTime()));
            } catch (Exception e) {}
        }
        if (dto.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(dto.getStatus()));
            } catch (Exception e) {}
        }
        if (dto.getSeats() != null) {
            try {
                String[] parts = dto.getSeats().split("/");
                if (parts.length > 1) {
                    event.setCapacity(Integer.parseInt(parts[1].trim()));
                } else {
                    event.setCapacity(Integer.parseInt(dto.getSeats().trim()));
                }
            } catch (NumberFormatException e) {
                // Ignore
            }
        }
        event = eventRepository.save(event);
        return AdminEventDto.builder()
                .dbId(event.getEventId())
                .id("EVT-" + String.format("%03d", event.getEventId()))
                .name(event.getTitle())
                .category(event.getCategory())
                .date(event.getEventDate() != null ? event.getEventDate().toString() : "N/A")
                .venue(event.getVenue())
                .price(dto.getPrice() != null ? dto.getPrice() : "Free")
                .seats("0/" + event.getCapacity())
                .rating(4.5)
                .description(event.getDescription())
                .startTime(event.getStartTime() != null ? event.getStartTime().toString() : null)
                .endTime(event.getEndTime() != null ? event.getEndTime().toString() : null)
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .build();
    }
}
