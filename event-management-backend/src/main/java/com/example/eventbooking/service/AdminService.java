package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

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
import org.springframework.cache.annotation.CacheEvict;

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
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;
    private final com.example.eventbooking.repository.ServiceRepository serviceRepository;
    private final com.example.eventbooking.repository.ServiceRequestRepository serviceRequestRepository;
    private final NotificationService notificationService;
    private final com.example.eventbooking.repository.TicketRepository ticketRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public AdminDashboardStatsDto getDashboardStats(User currentUser) {
        List<User> users = userRepository.findAll();
        List<Event> events = eventRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        boolean isSuper = currentUser.isSuperAdmin();

        if (!isSuper) {
            // Filter events created by the current admin
            events = events.stream()
                .filter(e -> e.getOrganizer() != null && e.getOrganizer().getUserId().equals(currentUser.getUserId()))
                .collect(Collectors.toList());
                
            // Filter bookings for these events
            List<Event> finalEvents = events;
            bookings = bookings.stream()
                .filter(b -> b.getEvent() != null && finalEvents.stream().anyMatch(e -> e.getEventId().equals(b.getEvent().getEventId())))
                .collect(Collectors.toList());
                
            // Count unique customers who booked their events
            users = bookings.stream().map(Booking::getUser).filter(java.util.Objects::nonNull).distinct().collect(Collectors.toList());
        }

        long totalUsers = users.size();
        long totalEvents = events.size();
        
        List<Booking> activeBookings = bookings.stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()) && !"FAILED".equalsIgnoreCase(b.getStatus()))
                .collect(Collectors.toList());

        long totalBookings = activeBookings.size();

        BigDecimal totalRevenue = activeBookings.stream()
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
        for (String d : last14Days)
            revenueByDate.put(d, BigDecimal.ZERO);

        activeBookings.forEach(b -> {
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
                .collect(Collectors.groupingBy(e -> e.getCategory() != null ? e.getCategory() : "Other",
                        Collectors.counting()));

        String[] colors = { "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444" };
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
        for (String d : last14Days)
            userCountsByDate.put(d, 0L);

        if (isSuper) {
            users.forEach(u -> {
                if (u.getCreatedAt() != null) {
                    String dateStr = u.getCreatedAt().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd"));
                    if (userCountsByDate.containsKey(dateStr)) {
                        userCountsByDate.put(dateStr, userCountsByDate.get(dateStr) + 1);
                    }
                }
            });
        } else {
            bookings.forEach(b -> {
                if (b.getBookingDate() != null) {
                    String dateStr = b.getBookingDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd"));
                    if (userCountsByDate.containsKey(dateStr)) {
                        userCountsByDate.put(dateStr, userCountsByDate.get(dateStr) + 1);
                    }
                }
            });
        }

        long cumulativeUsers = 0;
        if (isSuper) {
            cumulativeUsers = userRepository.findAll().stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().isBefore(today.minusDays(13)))
                    .count();
        }
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
                        .id(com.example.eventbooking.service.CustomerService.generateTicketCode(b.getId()))
                        .type("booking")
                        .description("New booking for " + (b.getEvent() != null ? b.getEvent().getTitle() : "Event"))
                        .timeAgo(getTimeAgo(b.getBookingDate()))
                        .build();
                allActivities.add(new java.util.AbstractMap.SimpleEntry<>(dto, b.getBookingDate()));
            }
        });

        if (isSuper) {
            userRepository.findAll().forEach(u -> {
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
        }

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
        for (String d : last14Days)
            bookingsCountByDate.put(d, 0L);
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
        for (Booking b : activeBookings) {
            if (b.getEvent() != null) {
                eventRevenue.put(b.getEvent(),
                        eventRevenue.getOrDefault(b.getEvent(), BigDecimal.ZERO).add(b.getAmount()));
            }
        }
        BigDecimal totalPlatformRevenue = totalRevenue.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ONE : totalRevenue; // avoid division by zero
        List<java.util.Map.Entry<Event, BigDecimal>> sortedEvents = eventRevenue.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toList());

        List<AdminDashboardStatsDto.TopEventDto> topEvents = new java.util.ArrayList<>();
        BigDecimal top5Revenue = BigDecimal.ZERO;
        
        double top5PercentageSum = 0;
        for (int i = 0; i < Math.min(5, sortedEvents.size()); i++) {
            var e = sortedEvents.get(i);
            top5Revenue = top5Revenue.add(e.getValue());
            double percentage = e.getValue().multiply(new BigDecimal("100"))
                    .divide(totalPlatformRevenue, 2, java.math.RoundingMode.HALF_UP).doubleValue();
            top5PercentageSum += percentage;
            topEvents.add(AdminDashboardStatsDto.TopEventDto.builder()
                    .id(e.getKey().getEventId())
                    .name(e.getKey().getTitle())
                    .revenue(e.getValue())
                    .percentage(percentage)
                    .build());
        }

        System.out.println("DEBUG - totalRevenue: " + totalRevenue);
        System.out.println("DEBUG - top5Revenue: " + top5Revenue);
        System.out.println("DEBUG - totalPlatformRevenue: " + totalPlatformRevenue);
        System.out.println("DEBUG - activeBookings size: " + activeBookings.size());

        if (sortedEvents.size() > 5 || top5Revenue.compareTo(totalRevenue) < 0) {
            BigDecimal otherRevenue = totalRevenue.subtract(top5Revenue);
            if (otherRevenue.compareTo(BigDecimal.ZERO) > 0) {
                double otherPercentage = Math.max(0.0, 100.0 - top5PercentageSum);
                // Round to 2 decimal places in case of floating point precision issues
                otherPercentage = Math.round(otherPercentage * 100.0) / 100.0;
                
                topEvents.add(AdminDashboardStatsDto.TopEventDto.builder()
                        .id(-1)
                        .name("Other Events")
                        .revenue(otherRevenue)
                        .percentage(otherPercentage)
                        .build());
            }
        }

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
        if (pastTime == null)
            return "Unknown";
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        long minutes = java.time.Duration.between(pastTime, now).toMinutes();
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + " min ago";
        long hours = minutes / 60;
        if (hours < 24)
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }

    public List<AdminUserDto> getAllUsers(User currentUser) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage users");
        }
        return userRepository.findAll().stream()
                .map(user -> AdminUserDto.builder()
                        .dbId(user.getUserId())
                        .id("USR-" + String.format("%03d", user.getUserId()))
                        .name(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole() != null ? user.getRole().name() : "customer")
                        .status("Active") // Defaulting for now
                        .joinedDate(user.getCreatedAt() != null ? user.getCreatedAt().format(FORMATTER) : "N/A")
                        .profilePicture(user.getProfilePicture())
                        .isSuperAdmin(user.isSuperAdmin())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminEventDto> getAllEvents(User currentUser) {
        java.util.stream.Stream<Event> stream = eventRepository.findAll().stream();
        if (!currentUser.isSuperAdmin()) {
            stream = stream.filter(e -> e.getOrganizer() != null && e.getOrganizer().getUserId().equals(currentUser.getUserId()));
        }
        return stream
                .map(event -> {
                    String priceStr = "Free";
                    if (event.getTickets() != null && !event.getTickets().isEmpty()) {
                        java.math.BigDecimal minPrice = null;
                        for (com.example.eventbooking.entity.Ticket ticket : event.getTickets()) {
                            if (minPrice == null || ticket.getPrice().compareTo(minPrice) < 0) {
                                minPrice = ticket.getPrice();
                            }
                        }
                        if (minPrice != null && minPrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                            priceStr = "$" + minPrice.toString();
                        }
                    }
                    
                    return AdminEventDto.builder()
                        .dbId(event.getEventId())
                        .id("EVT-" + String.format("%03d", event.getEventId()))
                        .name(event.getTitle())
                        .category(event.getCategory())
                        .date(event.getEventDate() != null ? event.getEventDate().toString() : "N/A")
                        .venue(event.getVenue())
                        .imageUrl(event.getImageUrl())
                        .price(priceStr)
                        .seats(formatSeats(event))
                        .rating(4.5) // Defaulting for now
                        .description(event.getDescription())
                        .startTime(event.getStartTime() != null ? event.getStartTime().toString() : null)
                        .endTime(event.getEndTime() != null ? event.getEndTime().toString() : null)
                        .status(event.getStatus() != null ? event.getStatus().name() : null)
                        .serviceIds(serviceRequestRepository.findByEventEventId(event.getEventId()).stream()
                                .map(r -> r.getService().getId())
                                .collect(Collectors.toList()))
                        .rejectedServiceIds(serviceRequestRepository.findByEventEventId(event.getEventId()).stream()
                                .filter(r -> "rejected".equalsIgnoreCase(r.getStatus()))
                                .map(r -> r.getService().getId())
                                .collect(Collectors.toList()))
                        .lockedServiceIds(serviceRequestRepository.findByEventEventId(event.getEventId()).stream()
                                .filter(r -> "accepted".equalsIgnoreCase(r.getStatus()) || "completed".equalsIgnoreCase(r.getStatus()) || "rejected".equalsIgnoreCase(r.getStatus()))
                                .map(r -> r.getService().getId())
                                .collect(Collectors.toList()))
                        .build();
                })
                .collect(Collectors.toList());
    }

    public List<AdminVendorDto> getAllVendors(User currentUser) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage vendors");
        }
        return vendorRepository.findAll().stream()
                .map(vendor -> AdminVendorDto.builder()
                        .dbId(vendor.getId())
                        .id("VND-" + String.format("%03d", vendor.getId()))
                        .name(vendor.getBusinessName())
                        .owner(vendor.getUser().getFullName())
                        .email(vendor.getUser().getEmail())
                        .status(vendor.getApplicationStatus() != null ? 
                                vendor.getApplicationStatus().substring(0, 1).toUpperCase() + vendor.getApplicationStatus().substring(1).toLowerCase() : 
                                (vendor.getIsVerified() != null && vendor.getIsVerified() ? "Verified" : "Pending"))
                        .properties(0)
                        .joined(vendor.getCreatedAt() != null ? vendor.getCreatedAt().format(FORMATTER) : "N/A")
                        .businessDesc(vendor.getBusinessDesc())
                        .contactEmail(vendor.getContactEmail())
                        .contactPhone(vendor.getContactPhone())
                        .businessAddress(vendor.getBusinessAddress())
                        .profilePicture(vendor.getUser().getProfilePicture())
                        .citizenshipImage(vendor.getCitizenshipImage())
                        .passportPhoto(vendor.getPassportPhoto())
                        .panVatImage(vendor.getPanVatImage())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminBookingDto> getAllBookings(User currentUser) {
        java.util.stream.Stream<Booking> stream = bookingRepository.findAll().stream();
        if (!currentUser.isSuperAdmin()) {
            stream = stream.filter(b -> b.getEvent() != null && b.getEvent().getOrganizer() != null && b.getEvent().getOrganizer().getUserId().equals(currentUser.getUserId()));
        }
        return stream
                .map(booking -> AdminBookingDto.builder()
                        .id(com.example.eventbooking.service.CustomerService.generateTicketCode(booking.getId()))
                        .user(booking.getUser().getFullName())
                        .event(booking.getEvent().getTitle())
                        .amount("$" + booking.getAmount().toString())
                        .tickets(booking.getTicketCount())
                        .date(booking.getBookingDate() != null ? booking.getBookingDate().format(FORMATTER) : "N/A")
                        .status(booking.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public AdminUserDto updateUser(User currentUser, Integer id, AdminUserDto dto) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage users");
        }
        try {
            User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            user.setFullName(dto.getName());
            user.setEmail(dto.getEmail());
            if (dto.getRole() != null) {
                user.setRole(parseRole(dto.getRole()));
            }
            if (dto.getStatus() != null) {
                user.setActive("Active".equalsIgnoreCase(dto.getStatus()));
            }
            if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
            }
            user.setSuperAdmin("administrator".equalsIgnoreCase(user.getRole().name()) && dto.getIsSuperAdmin() != null && dto.getIsSuperAdmin());
            
            user = userRepository.save(user);
            return AdminUserDto.builder()
                    .dbId(user.getUserId())
                    .id("USR-" + String.format("%03d", user.getUserId()))
                    .name(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole().name() : "customer")
                    .status(user.isActive() ? "Active" : "Inactive")
                    .joinedDate(user.getCreatedAt() != null ? user.getCreatedAt().format(FORMATTER) : "N/A")
                    .profilePicture(user.getProfilePicture())
                    .isSuperAdmin(user.isSuperAdmin())
                    .build();
        } catch (Exception e) {
            System.err.println("ERROR: Failed to update user in AdminService: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateEventServices(Event event, User currentUser, List<Integer> serviceIds) {
        if (serviceIds == null) {
            serviceIds = new java.util.ArrayList<>();
        }

        List<com.example.eventbooking.entity.ServiceRequest> existingRequests = serviceRequestRepository.findByEventEventId(event.getEventId());
        
        // Remove requests not in the new list
        for (com.example.eventbooking.entity.ServiceRequest req : existingRequests) {
            if (!serviceIds.contains(req.getService().getId())) {
                serviceRequestRepository.delete(req);
            }
        }

        // Find existing service IDs to avoid duplicates
        java.util.Set<Integer> existingServiceIds = existingRequests.stream()
                .map(r -> r.getService().getId())
                .collect(Collectors.toSet());

        for (Integer serviceId : serviceIds) {
            if (existingServiceIds.contains(serviceId)) {
                continue; // Already requested
            }
            
            com.example.eventbooking.entity.Service service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
            
            com.example.eventbooking.entity.ServiceRequest req = new com.example.eventbooking.entity.ServiceRequest();
            req.setEvent(event);
            req.setService(service);
            req.setClient(currentUser);
            req.setEventDate(event.getEventDate());
            req.setAmount(service.getPrice());
            req.setStatus("requested"); // Set status as requested so it goes to vendor requests dashboard
            req = serviceRequestRepository.save(req);

            // Send notification to vendor owner
            if (service.getVendor() != null && service.getVendor().getUser() != null) {
                notificationService.createNotification(
                        service.getVendor().getUser(),
                        "New Service Request",
                        "Admin requested your service '" + service.getServiceName() + "' for event '" + event.getTitle() + "'.",
                        "request",
                        event.getEventId(),
                        req.getId()
                );
            }
            
            // Notify other admins about the new request
            notificationService.notifyAllAdmins(
                    "New Service Request",
                    "Admin requested the service '" + service.getServiceName() + "' from vendor '" + 
                    (service.getVendor() != null ? service.getVendor().getBusinessName() : "Unknown") + 
                    "' for event '" + event.getTitle() + "'.",
                    "request",
                    event.getEventId(),
                    req.getId(),
                    currentUser
            );
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @CacheEvict(value = "events", allEntries = true)
    public AdminEventDto updateEvent(User currentUser, Integer id, AdminEventDto dto) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (!currentUser.isSuperAdmin() && !event.getOrganizer().getUserId().equals(currentUser.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: you can only update your own events");
        }
        EventStatus oldStatus = event.getStatus();
        event.setTitle(dto.getName());
        event.setCategory(dto.getCategory());
        event.setVenue(dto.getVenue());
        if (dto.getImageUrl() != null) {
            event.setImageUrl(dto.getImageUrl());
        }
        if (dto.getCurrency() != null && !dto.getCurrency().isEmpty()) {
            event.setCurrency(dto.getCurrency());
        }
        if (dto.getDescription() != null) {
            event.setDescription(dto.getDescription());
        }
        if (dto.getDate() != null && !dto.getDate().equals("N/A")) {
            try {
                LocalDate parsedDate = LocalDate.parse(dto.getDate());
                if (parsedDate.isBefore(LocalDate.now())) {
                    throw new IllegalArgumentException("Event date cannot be in the past");
                }
                event.setEventDate(parsedDate);
            } catch (java.time.format.DateTimeParseException e) {
                // Ignore invalid date format
            }
        }
        if (dto.getStartTime() != null && !dto.getStartTime().isEmpty()) {
            try {
                event.setStartTime(LocalTime.parse(dto.getStartTime()));
            } catch (Exception e) {
            }
        }
        if (dto.getEndTime() != null && !dto.getEndTime().isEmpty()) {
            try {
                event.setEndTime(LocalTime.parse(dto.getEndTime()));
            } catch (Exception e) {
            }
        }
        if (dto.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(dto.getStatus()));
            } catch (Exception e) {
            }
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
        
        // Update chosen vendor services
        updateEventServices(event, currentUser, dto.getServiceIds());

        if (oldStatus != EventStatus.published && event.getStatus() == EventStatus.published) {
            String title = "New Event Published: " + event.getTitle();
            String message = "A new event '" + event.getTitle() + "' in the " + event.getCategory() + " category has just been announced! Book your tickets now.";
            notificationService.notifyAllCustomersAndVendors(title, message, "event_alert", event.getEventId());
        }

        return AdminEventDto.builder()
                .dbId(event.getEventId())
                .id("EVT-" + String.format("%03d", event.getEventId()))
                .name(event.getTitle())
                .category(event.getCategory())
                .date(event.getEventDate() != null ? event.getEventDate().toString() : "N/A")
                .venue(event.getVenue())
                .imageUrl(event.getImageUrl())
                .price(dto.getPrice() != null ? dto.getPrice() : "Free")
                .currency(event.getCurrency())
                .seats(formatSeats(event))
                .rating(4.5)
                .description(event.getDescription())
                .startTime(event.getStartTime() != null ? event.getStartTime().toString() : null)
                .endTime(event.getEndTime() != null ? event.getEndTime().toString() : null)
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .serviceIds(dto.getServiceIds())
                .build();
    }

    @CacheEvict(value = "events", allEntries = true)
    public void deleteEvent(User currentUser, Integer id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (!currentUser.isSuperAdmin() && !event.getOrganizer().getUserId().equals(currentUser.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: you can only delete your own events");
        }
        eventRepository.delete(event);
    }

    @org.springframework.transaction.annotation.Transactional
    @CacheEvict(value = "events", allEntries = true)
    public AdminEventDto createEvent(User currentUser, AdminEventDto dto) {
        EventStatus status = EventStatus.draft;
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            try {
                status = EventStatus.valueOf(dto.getStatus());
            } catch (Exception e) {}
        }
        Event event = Event.builder()
                .organizer(currentUser)
                .title(dto.getName() != null ? dto.getName() : "Untitled Event")
                .description(dto.getDescription())
                .category(dto.getCategory() != null ? dto.getCategory() : "General")
                .venue(dto.getVenue() != null ? dto.getVenue() : "TBD")
                .imageUrl(dto.getImageUrl())
                .currency(dto.getCurrency() != null && !dto.getCurrency().isEmpty() ? dto.getCurrency() : "USD")
                .status(status)
                .capacity(100)
                .eventDate(LocalDate.now())
                .startTime(LocalTime.of(9, 0))
                .build();
        if (dto.getDate() != null && !dto.getDate().equals("N/A") && !dto.getDate().isEmpty()) {
            try {
                LocalDate parsedDate = LocalDate.parse(dto.getDate());
                if (parsedDate.isBefore(LocalDate.now())) {
                    throw new IllegalArgumentException("Event date cannot be in the past");
                }
                event.setEventDate(parsedDate);
            } catch (java.time.format.DateTimeParseException e) {
            }
        } else if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Event date cannot be in the past");
        }
        event = eventRepository.save(event);

        // Create a default Ticket
        java.math.BigDecimal price = java.math.BigDecimal.ZERO;
        if (dto.getPrice() != null && !dto.getPrice().equalsIgnoreCase("Free")) {
            try {
                price = new java.math.BigDecimal(dto.getPrice().replace("$", "").trim());
            } catch (Exception e) {}
        }
        
        com.example.eventbooking.entity.Ticket ticket = com.example.eventbooking.entity.Ticket.builder()
                .event(event)
                .ticketType("General Admission")
                .price(price)
                .quantityAvailable(event.getCapacity())
                .quantitySold(0)
                .build();
        ticketRepository.save(ticket);

        // Update chosen vendor services
        updateEventServices(event, currentUser, dto.getServiceIds());

        if (event.getStatus() == EventStatus.published) {
            String title = "New Event Published: " + event.getTitle();
            String message = "A new event '" + event.getTitle() + "' in the " + event.getCategory() + " category has just been announced! Book your tickets now.";
            notificationService.notifyAllCustomersAndVendors(title, message, "event_alert", event.getEventId());
        }

        return AdminEventDto.builder()
                .dbId(event.getEventId())
                .id("EVT-" + String.format("%03d", event.getEventId()))
                .name(event.getTitle())
                .category(event.getCategory())
                .date(event.getEventDate() != null ? event.getEventDate().toString() : "N/A")
                .venue(event.getVenue())
                .price(dto.getPrice() != null ? dto.getPrice() : "Free")
                .currency(event.getCurrency())
                .seats(formatSeats(event))
                .rating(0.0)
                .description(event.getDescription())
                .status(event.getStatus().name())
                .serviceIds(dto.getServiceIds())
                .build();
    }

    public AdminVendorDto inviteVendor(User currentUser, AdminVendorInviteDto dto) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage vendors");
        }
        return AdminVendorDto.builder()
                .id("VND-999")
                .owner("Invited Vendor")
                .name(dto.getBusinessName())
                .email(dto.getEmail())
                .status("Pending")
                .properties(0)
                .joined("N/A")
                .build();
    }

    public AdminVendorDto updateVendor(User currentUser, Integer id, AdminVendorDto dto) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage vendors");
        }
        
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            
        User user = vendor.getUser();
        
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            vendor.setBusinessName(dto.getName());
        }
        if (dto.getOwner() != null && !dto.getOwner().trim().isEmpty()) {
            user.setFullName(dto.getOwner());
        }
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getStatus() != null) {
            String newStatus = dto.getStatus();
            
            // Only send notification if status is actually changing from Pending
            boolean statusChanging = vendor.getApplicationStatus() == null || "PENDING".equalsIgnoreCase(vendor.getApplicationStatus());
            
            vendor.setApplicationStatus(newStatus.toUpperCase());
            if ("Verified".equalsIgnoreCase(newStatus)) {
                vendor.setIsVerified(true);
                user.setActive(true);
                if (statusChanging) {
                    notificationService.createNotification(user, "Vendor Application Approved", "Congratulations! Your vendor application has been approved. You can now list your services.", "success", null, null);
                }
            } else if ("Rejected".equalsIgnoreCase(newStatus)) {
                vendor.setIsVerified(false);
                user.setActive(false);
                if (statusChanging) {
                    notificationService.createNotification(user, "Vendor Application Rejected", "We regret to inform you that your vendor application has been rejected.", "error", null, null);
                }
            }
        }
        if (dto.getBusinessDesc() != null) {
            vendor.setBusinessDesc(dto.getBusinessDesc());
        }
        if (dto.getContactEmail() != null) {
            vendor.setContactEmail(dto.getContactEmail());
        }
        if (dto.getContactPhone() != null) {
            vendor.setContactPhone(dto.getContactPhone());
        }
        if (dto.getBusinessAddress() != null) {
            vendor.setBusinessAddress(dto.getBusinessAddress());
        }
        
        userRepository.save(user);
        vendor = vendorRepository.save(vendor);
        
        return AdminVendorDto.builder()
                .id("VND-" + String.format("%03d", vendor.getId()))
                .name(vendor.getBusinessName())
                .owner(user.getFullName())
                .email(user.getEmail())
                .status(vendor.getApplicationStatus() != null ? 
                        vendor.getApplicationStatus().substring(0, 1).toUpperCase() + vendor.getApplicationStatus().substring(1).toLowerCase() : 
                        (vendor.getIsVerified() != null && vendor.getIsVerified() ? "Verified" : "Pending"))
                .properties(serviceRepository.findByVendorId(vendor.getId()).size())
                .joined(vendor.getCreatedAt() != null ? vendor.getCreatedAt().format(FORMATTER) : "N/A")
                .businessDesc(vendor.getBusinessDesc())
                .contactEmail(vendor.getContactEmail())
                .contactPhone(vendor.getContactPhone())
                .businessAddress(vendor.getBusinessAddress())
                .profilePicture(user.getProfilePicture())
                .citizenshipImage(vendor.getCitizenshipImage())
                .passportPhoto(vendor.getPassportPhoto())
                .panVatImage(vendor.getPanVatImage())
                .build();
    }

    public void deleteVendor(User currentUser, Integer id) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage vendors");
        }
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            
        User user = vendor.getUser();
        
        // Delete vendor related data first
        jdbcTemplate.update("DELETE FROM service_requests WHERE service_id IN (SELECT id FROM services WHERE vendor_id = ?)", id);
        jdbcTemplate.update("DELETE FROM vendor_blocked_dates WHERE vendor_id = ?", id);
        jdbcTemplate.update("DELETE FROM vendor_availability WHERE vendor_id = ?", id);
        jdbcTemplate.update("DELETE FROM services WHERE vendor_id = ?", id);
        jdbcTemplate.update("DELETE FROM vendors WHERE vendor_id = ?", id);
        
        // Then delete the user
        deleteUser(currentUser, user.getUserId());
    }

    private Role parseRole(String roleStr) {
        if (roleStr == null) return Role.customer;
        String normalized = roleStr.trim().toLowerCase();
        if ("admin".equals(normalized) || "administrator".equals(normalized)) {
            return Role.administrator;
        }
        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return Role.customer;
        }
    }

    public AdminUserDto createUser(User currentUser, AdminUserDto dto) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage users");
        }
        try {
            Role userRole = parseRole(dto.getRole());
            User user = User.builder()
                    .fullName(dto.getName())
                    .email(dto.getEmail())
                    .passwordHash(passwordEncoder.encode(dto.getPassword() != null && !dto.getPassword().trim().isEmpty() ? dto.getPassword() : "password123"))
                    .role(userRole)
                    .isSuperAdmin("administrator".equalsIgnoreCase(userRole.name()) && dto.getIsSuperAdmin() != null && dto.getIsSuperAdmin())
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
                    .profilePicture(user.getProfilePicture())
                    .isSuperAdmin(user.isSuperAdmin())
                    .build();

            return createdUser;
        } catch (Exception e) {
            System.err.println("ERROR: Failed to create user in AdminService: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteUser(User currentUser, Integer id) {
        if (!currentUser.isSuperAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: only super admins can manage users");
        }
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Delete favorites made by this user
        jdbcTemplate.update("DELETE FROM favorites WHERE user_id = ?", id);

        // 2. Delete service_requests made by this user
        jdbcTemplate.update("DELETE FROM service_requests WHERE requested_by = ?", id);

        // 3. Delete payments and bookings for this user as a customer
        jdbcTemplate.update("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE customer_id = ?)",
                id);
        jdbcTemplate.update("DELETE FROM bookings WHERE customer_id = ?", id);

        // 4. Delete related records for events organized by this user
        String eventsQuery = "SELECT event_id FROM events WHERE organizer_id = ?";
        String ticketsQuery = "SELECT ticket_id FROM tickets WHERE event_id IN (" + eventsQuery + ")";

        jdbcTemplate.update("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE ticket_id IN ("
                + ticketsQuery + "))", id);
        jdbcTemplate.update("DELETE FROM bookings WHERE ticket_id IN (" + ticketsQuery + ")", id);
        jdbcTemplate.update("DELETE FROM tickets WHERE event_id IN (" + eventsQuery + ")", id);
        jdbcTemplate.update("DELETE FROM favorites WHERE event_id IN (" + eventsQuery + ")", id);
        jdbcTemplate.update("DELETE FROM service_requests WHERE event_id IN (" + eventsQuery + ")", id);

        // 5. Delete events organized by this user
        jdbcTemplate.update("DELETE FROM events WHERE organizer_id = ?", id);

        // 6. Delete vendor profile for this user
        jdbcTemplate.update("DELETE FROM vendors WHERE user_id = ?", id);

        userRepository.delete(user);
    }

    public List<com.example.eventbooking.dto.response.ServiceRequestDto> getVendorApplications(User currentUser) {
        // Super admins see all, regular admins see only for their events
        List<com.example.eventbooking.entity.ServiceRequest> applications = serviceRequestRepository.findAll().stream()
                .filter(r -> "vendor_proposed".equals(r.getStatus()))
                .filter(r -> currentUser.isSuperAdmin() || 
                             (r.getEvent().getOrganizer() != null && r.getEvent().getOrganizer().getUserId().equals(currentUser.getUserId())))
                .collect(Collectors.toList());

        return applications.stream().map(this::convertServiceRequestToDto).collect(Collectors.toList());
    }

    public com.example.eventbooking.dto.response.ServiceRequestDto updateVendorApplicationStatus(User currentUser, Integer requestId, String newStatus) {
        com.example.eventbooking.entity.ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found"));

        if (!currentUser.isSuperAdmin() && !request.getEvent().getOrganizer().getUserId().equals(currentUser.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: you can only manage applications for your own events");
        }

        request.setStatus(newStatus);
        request = serviceRequestRepository.save(request);

        // Notify Vendor
        User vendorUser = request.getClient();
        if (vendorUser != null) {
            String title = newStatus.equals("accepted") ? "Application Accepted" : "Application Rejected";
            String msg = newStatus.equals("accepted") ? 
                    "Your application to provide '" + request.getService().getServiceName() + "' for the event '" + request.getEvent().getTitle() + "' was accepted!" :
                    "Your application to provide '" + request.getService().getServiceName() + "' for the event '" + request.getEvent().getTitle() + "' was declined.";
            notificationService.createNotification(vendorUser, title, msg, "request", request.getEvent().getEventId(), request.getId());
        }

        return convertServiceRequestToDto(request);
    }

    private com.example.eventbooking.dto.response.ServiceRequestDto convertServiceRequestToDto(com.example.eventbooking.entity.ServiceRequest request) {
        com.example.eventbooking.dto.response.ServiceRequestDto dto = new com.example.eventbooking.dto.response.ServiceRequestDto();
        dto.setId("REQ-" + String.format("%03d", request.getId()));
        dto.setRawId(request.getId());
        dto.setClient(request.getService().getVendor().getBusinessName());
        dto.setEventTitle(request.getEvent() != null ? request.getEvent().getTitle() : "Unknown Event");
        dto.setService(request.getService().getServiceName());
        dto.setDate(request.getEventDate());
        dto.setAmount(request.getAmount());
        dto.setStatus(request.getStatus());

        if (request.getEvent() != null) {
            com.example.eventbooking.dto.response.EventDto eventDto = com.example.eventbooking.dto.response.EventDto.builder()
                .id(request.getEvent().getEventId())
                .title(request.getEvent().getTitle())
                .category(request.getEvent().getCategory())
                .date(request.getEvent().getEventDate() != null ? request.getEvent().getEventDate().toString() : "N/A")
                .time(request.getEvent().getStartTime() != null ? request.getEvent().getStartTime().toString() : "N/A")
                .venue(request.getEvent().getVenue())
                .description(request.getEvent().getDescription())
                .imageUrl(request.getEvent().getImageUrl())
                .build();
            dto.setEventDetails(eventDto);
        }
        return dto;
    }

    public List<ServiceDto> getAllAvailableServices() {
        return serviceRepository.findAll().stream()
                .map(s -> {
                    ServiceDto dto = new ServiceDto();
                    dto.setId(s.getId());
                    dto.setVendorId(s.getVendor().getId());
                    dto.setServiceName(s.getServiceName() + " (" + s.getVendor().getBusinessName() + ")");
                    dto.setCategory(s.getCategory());
                    dto.setPrice(s.getPrice());
                    dto.setIsActive(s.getIsActive());
                    dto.setImageUrl(s.getImageUrl());
                    dto.setDescription(s.getDescription());
                    dto.setRegion(s.getRegion());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private String formatSeats(Event event) {
        long bookedCount = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(Booking::getTicketCount)
                .sum();
        return bookedCount + "/" + event.getCapacity();
    }
}
