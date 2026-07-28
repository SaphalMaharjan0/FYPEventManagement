package com.example.eventbooking.service;

import com.example.eventbooking.dto.request.*;
import com.example.eventbooking.dto.response.*;
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
        List<User> users = userRepository.findAll();
        List<Event> events = eventRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        long totalUsers = users.size();
        long totalEvents = events.size();
        long totalBookings = bookings.size();
        
        BigDecimal totalRevenue = bookings.stream()
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Generate last 14 days
        List<String> last14Days = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 13; i >= 0; i--) {
            last14Days.add(today.minusDays(i).format(DateTimeFormatter.ofPattern("MMM dd")));
        }

        // 1. Daily Revenue
        java.util.Map<String, BigDecimal> revenueByDate = new java.util.LinkedHashMap<>();
        for (String d : last14Days) revenueByDate.put(d, BigDecimal.ZERO);
        
        bookings.forEach(b -> {
            if (b.getBookingDate() != null) {
                String dateStr = b.getBookingDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd"));
                if (revenueByDate.containsKey(dateStr)) {
                    revenueByDate.put(dateStr, revenueByDate.get(dateStr).add(b.getAmount()));
                }
            }
        });
        List<AdminDashboardStatsDto.ChartData> monthlyRevenue = revenueByDate.entrySet().stream()
            .map(e -> AdminDashboardStatsDto.ChartData.builder().name(e.getKey()).value(e.getValue()).build())
            .collect(Collectors.toList());

        // 2. Events by Category
        java.util.Map<String, Long> categoryCounts = events.stream()
            .collect(Collectors.groupingBy(e -> e.getCategory() != null ? e.getCategory() : "Other", Collectors.counting()));
        
        String[] colors = {"#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"};
        List<AdminDashboardStatsDto.ChartData> eventsByCategory = new java.util.ArrayList<>();
        int colorIdx = 0;
        for (java.util.Map.Entry<String, Long> entry : categoryCounts.entrySet()) {
            eventsByCategory.add(AdminDashboardStatsDto.ChartData.builder()
                .name(entry.getKey())
                .value(entry.getValue())
                .color(colors[colorIdx % colors.length])
                .build());
            colorIdx++;
        }

        // 3. User Growth
        java.util.Map<String, Long> userCountsByDate = new java.util.LinkedHashMap<>();
        for (String d : last14Days) userCountsByDate.put(d, 0L);
        
        users.forEach(u -> {
            if (u.getCreatedAt() != null) {
                String dateStr = u.getCreatedAt().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd"));
                if (userCountsByDate.containsKey(dateStr)) {
                    userCountsByDate.put(dateStr, userCountsByDate.get(dateStr) + 1);
                }
            }
        });
        
        long cumulativeUsers = users.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().isBefore(today.minusDays(13)))
                .count();
        List<AdminDashboardStatsDto.ChartData> userGrowthData = new java.util.ArrayList<>();
        for (String d : last14Days) {
            cumulativeUsers += userCountsByDate.get(d);
            userGrowthData.add(AdminDashboardStatsDto.ChartData.builder().name(d).value(cumulativeUsers).build());
        }

        // 4. Recent Activity
        List<java.util.Map.Entry<AdminDashboardStatsDto.ActivityDto, java.time.LocalDateTime>> allActivities = new java.util.ArrayList<>();
        
        bookings.forEach(b -> {
            if (b.getBookingDate() != null) {
                AdminDashboardStatsDto.ActivityDto dto = AdminDashboardStatsDto.ActivityDto.builder()
                    .id("BK-" + b.getId())
                    .type("booking")
                    .description("New booking for " + (b.getEvent() != null ? b.getEvent().getTitle() : "Event"))
                    .timeAgo(getTimeAgo(b.getBookingDate()))
                    .build();
                allActivities.add(new java.util.AbstractMap.SimpleEntry<>(dto, b.getBookingDate()));
            }
        });

        users.forEach(u -> {
            if (u.getCreatedAt() != null) {
                AdminDashboardStatsDto.ActivityDto dto = AdminDashboardStatsDto.ActivityDto.builder()
                    .id("USR-" + u.getUserId())
                    .type("user")
                    .description("New user registered: " + u.getFullName())
                    .timeAgo(getTimeAgo(u.getCreatedAt()))
                    .build();
                allActivities.add(new java.util.AbstractMap.SimpleEntry<>(dto, u.getCreatedAt()));
            }
        });

        events.forEach(e -> {
            if (e.getCreatedAt() != null) {
                AdminDashboardStatsDto.ActivityDto dto = AdminDashboardStatsDto.ActivityDto.builder()
                    .id("EVT-" + e.getEventId())
                    .type("event")
                    .description("Event created: " + e.getTitle())
                    .timeAgo(getTimeAgo(e.getCreatedAt()))
                    .build();
                allActivities.add(new java.util.AbstractMap.SimpleEntry<>(dto, e.getCreatedAt()));
            }
        });

        List<AdminDashboardStatsDto.ActivityDto> recentActivity = allActivities.stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .limit(5)
            .map(java.util.Map.Entry::getKey)
            .collect(Collectors.toList());

        // 5. Bookings by Date (for Reports)
        java.util.Map<String, Long> bookingsCountByDate = new java.util.LinkedHashMap<>();
        for (String d : last14Days) bookingsCountByDate.put(d, 0L);
        bookings.forEach(b -> {
            if (b.getBookingDate() != null) {
                String dateStr = b.getBookingDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd"));
                if (bookingsCountByDate.containsKey(dateStr)) {
                    bookingsCountByDate.put(dateStr, bookingsCountByDate.get(dateStr) + 1);
                }
            }
        });
        List<AdminDashboardStatsDto.ChartData> bookingsByDate = bookingsCountByDate.entrySet().stream()
            .map(e -> AdminDashboardStatsDto.ChartData.builder().name(e.getKey()).value(e.getValue()).build())
            .collect(Collectors.toList());

        // 6. Top Events (for Reports)
        java.util.Map<Event, BigDecimal> eventRevenue = new java.util.HashMap<>();
        for (Booking b : bookings) {
            if (b.getEvent() != null) {
                eventRevenue.put(b.getEvent(), eventRevenue.getOrDefault(b.getEvent(), BigDecimal.ZERO).add(b.getAmount()));
            }
        }
        BigDecimal totalPlatformRevenue = totalRevenue.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ONE : totalRevenue; // avoid division by zero
        List<AdminDashboardStatsDto.TopEventDto> topEvents = eventRevenue.entrySet().stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .limit(5)
            .map(e -> AdminDashboardStatsDto.TopEventDto.builder()
                .id(e.getKey().getEventId())
                .name(e.getKey().getTitle())
                .revenue(e.getValue())
                .percentage(e.getValue().multiply(new BigDecimal("100")).divide(totalPlatformRevenue, 2, java.math.RoundingMode.HALF_UP).doubleValue())
                .build())
            .collect(Collectors.toList());



        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .eventsByCategory(eventsByCategory)
                .userGrowthData(userGrowthData)
                .recentActivity(recentActivity)
                .bookingsByDate(bookingsByDate)
                .topEvents(topEvents)
                .build();
    }

    private String getTimeAgo(java.time.LocalDateTime pastTime) {
        if (pastTime == null) return "Unknown";
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        long minutes = java.time.Duration.between(pastTime, now).toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " min ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
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
                        .imageUrl(event.getImageUrl())
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
        if (dto.getImageUrl() != null) {
            event.setImageUrl(dto.getImageUrl());
        }
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
                .imageUrl(event.getImageUrl())
                .price(dto.getPrice() != null ? dto.getPrice() : "Free")
                .seats("0/" + event.getCapacity())
                .rating(4.5)
                .description(event.getDescription())
                .startTime(event.getStartTime() != null ? event.getStartTime().toString() : null)
                .endTime(event.getEndTime() != null ? event.getEndTime().toString() : null)
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .build();
    }

    public AdminEventDto createEvent(AdminEventDto dto) {
        // Assume first user is admin/organizer for dummy creation since auth might not be fully wired in this method signature
        User admin = userRepository.findAll().stream().findFirst().orElseThrow(() -> new RuntimeException("No admin user found"));
        
        Event event = Event.builder()
                .organizer(admin)
                .title(dto.getName() != null ? dto.getName() : "Untitled Event")
                .description(dto.getDescription())
                .category(dto.getCategory() != null ? dto.getCategory() : "General")
                .venue(dto.getVenue() != null ? dto.getVenue() : "TBD")
                .imageUrl(dto.getImageUrl())
                .status(EventStatus.draft)
                .capacity(100)
                .eventDate(LocalDate.now())
                .startTime(LocalTime.of(9,0))
                .build();
        if (dto.getDate() != null && !dto.getDate().equals("N/A") && !dto.getDate().isEmpty()) {
            try {
                event.setEventDate(LocalDate.parse(dto.getDate()));
            } catch (Exception e) {}
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
                .rating(0.0)
                .description(event.getDescription())
                .status(event.getStatus().name())
                .build();
    }

    public AdminVendorDto inviteVendor(AdminVendorInviteDto dto) {
        // Simple stub
        return AdminVendorDto.builder()
                .name(dto.getBusinessName())
                .owner("Invited Vendor")
                .email(dto.getEmail())
                .status("Pending")
                .joined("N/A")
                .build();
    }

    public AdminUserDto createUser(AdminUserDto dto) {
        User user = User.builder()
                .fullName(dto.getName())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword() != null ? dto.getPassword() : "password"))
                .role(dto.getRole() != null ? Role.valueOf(dto.getRole().toLowerCase()) : Role.customer)
                .isActive(true)
                .build();
        user = userRepository.save(user);
        
        AdminUserDto createdUser = AdminUserDto.builder()
                .dbId(user.getUserId())
                .id("USR-" + String.format("%03d", user.getUserId()))
                .name(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status("Active")
                .joinedDate(user.getCreatedAt() != null ? user.getCreatedAt().format(FORMATTER) : "Just now")
                .build();
                
        return createdUser;
    }
}
