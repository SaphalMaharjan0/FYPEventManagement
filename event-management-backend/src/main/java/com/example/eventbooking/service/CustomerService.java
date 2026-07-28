package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.CustomerDashboardStatsDto;
import com.example.eventbooking.entity.Booking;
import com.example.eventbooking.entity.Event;
import com.example.eventbooking.dto.response.CustomerBookingDto;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.FavoriteRepository;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.entity.Favorite;
import com.example.eventbooking.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;

import com.example.eventbooking.dto.request.EsewaInitiateRequest;
import com.example.eventbooking.dto.response.EsewaInitiateResponse;
import com.example.eventbooking.util.EsewaUtil;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final BookingRepository bookingRepository;
    private final FavoriteRepository favoriteRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public boolean toggleFavorite(Integer userId, Integer eventId) {
        Optional<Favorite> existingFavorite = favoriteRepository.findByUser_UserIdAndEvent_EventId(userId, eventId);
        
        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return false; // returned false means un-favorited
        } else {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
            
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .event(event)
                    .build();
            favoriteRepository.save(favorite);
            return true; // returned true means favorited
        }
    }

    @Transactional(readOnly = true)
    public List<CustomerDashboardStatsDto.EventDto> getFavoriteEvents(Integer userId) {
        DateTimeFormatter Formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        return favoriteRepository.findByUser_UserId(userId).stream()
                .map(Favorite::getEvent)
                .map(e -> CustomerDashboardStatsDto.EventDto.builder()
                        .id(e.getEventId().longValue())
                        .title(e.getTitle())
                        .date(e.getEventDate() != null ? e.getEventDate().format(Formatter) : "TBD")
                        .venue(e.getVenue())
                        .image(e.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CustomerBookingDto> getUserBookings(Integer userId) {
        List<Booking> userBookings = bookingRepository.findByUser_UserId(userId);
        DateTimeFormatter Formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        return userBookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .map(b -> {
                    String timeStr = "07:00 PM";
                    if (b.getEvent() != null && b.getEvent().getStartTime() != null) {
                        timeStr = b.getEvent().getStartTime().format(timeFormatter);
                    }
                    return CustomerBookingDto.builder()
                        .id(b.getId())
                        .bookingId(generateTicketCode(b.getId()))
                        .title(b.getEvent() != null ? b.getEvent().getTitle() : "Unknown Event")
                        .date(b.getEvent() != null && b.getEvent().getEventDate() != null ? b.getEvent().getEventDate().format(Formatter) : "TBD")
                        .time(timeStr)
                        .venue(b.getEvent() != null ? b.getEvent().getVenue() : "TBD")
                        .image(b.getEvent() != null ? b.getEvent().getImageUrl() : "")
                        .tickets(b.getTicketCount())
                        .pricePaid(b.getAmount())
                        .status(b.getStatus())
                        .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDashboardStatsDto getDashboardStats(Integer userId) {
        List<Booking> userBookings = bookingRepository.findByUser_UserId(userId);
        
        long totalBookings = userBookings.size();
        
        BigDecimal amountSpent = userBookings.stream()
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DateTimeFormatter Formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        LocalDate today = LocalDate.now();

        List<CustomerDashboardStatsDto.EventDto> upcomingEvents = userBookings.stream()
                .map(Booking::getEvent)
                .distinct()
                .filter(e -> e.getEventDate() != null && !e.getEventDate().isBefore(today))
                .sorted(Comparator.comparing(Event::getEventDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(3)
                .map(e -> CustomerDashboardStatsDto.EventDto.builder()
                        .id(e.getEventId().longValue())
                        .title(e.getTitle())
                        .date(e.getEventDate().format(Formatter))
                        .venue(e.getVenue())
                        .image(e.getImageUrl())
                        .build())
                .collect(Collectors.toList());

        long upcomingEventsCount = userBookings.stream()
                .map(Booking::getEvent)
                .distinct()
                .filter(e -> e.getEventDate() != null && !e.getEventDate().isBefore(today))
                .count();

        long favoritesCount = favoriteRepository.findByUser_UserId(userId).size();

        List<CustomerDashboardStatsDto.ActivityDto> recentActivity = userBookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .limit(5)
                .map(b -> CustomerDashboardStatsDto.ActivityDto.builder()
                        .id(generateTicketCode(b.getId()))
                        .type("booking")
                        .description("Booked " + (b.getEvent() != null ? b.getEvent().getTitle() : "Unknown") + " · " + b.getTicketCount() + " tickets")
                        .timeAgo(getTimeAgo(b.getBookingDate()))
                        .build())
                .collect(Collectors.toList());

        return CustomerDashboardStatsDto.builder()
                .totalBookings(totalBookings)
                .amountSpent(amountSpent)
                .upcomingEventsCount(upcomingEventsCount)
                .favoritesCount(favoritesCount)
                .upcomingEvents(upcomingEvents)
                .recentActivity(recentActivity)
                .build();
    }

    @Transactional
    public EsewaInitiateResponse initiateEsewaBooking(Integer userId, EsewaInitiateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(request.getEventId()).orElseThrow(() -> new RuntimeException("Event not found"));

        int bookedTickets = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(Booking::getTicketCount)
                .sum();
        int seatsLeft = event.getCapacity() - bookedTickets;

        if (seatsLeft < request.getQuantity()) {
            throw new RuntimeException("Not enough seats available");
        }

        BigDecimal price = BigDecimal.valueOf(50.0); // Dummy price used in EventService
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(request.getQuantity()));

        String transactionUuid = UUID.randomUUID().toString();

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .ticketCount(request.getQuantity())
                .amount(totalAmount)
                .status("PENDING")
                .bookingDate(LocalDateTime.now())
                .transactionUuid(transactionUuid)
                .paymentMethod("eSewa")
                .build();

        bookingRepository.save(booking);

        String amountStr = totalAmount.toString();
        String signedFieldNames = "total_amount,transaction_uuid,product_code";
        String message = "total_amount=" + amountStr + ",transaction_uuid=" + transactionUuid + ",product_code=" + EsewaUtil.PRODUCT_CODE;
        String signature = EsewaUtil.generateSignature(message, EsewaUtil.SECRET_KEY);

        return EsewaInitiateResponse.builder()
                .signature(signature)
                .signedFieldNames(signedFieldNames)
                .transactionUuid(transactionUuid)
                .amount(amountStr)
                .taxAmount("0")
                .totalAmount(amountStr)
                .productCode(EsewaUtil.PRODUCT_CODE)
                .productDeliveryCharge("0")
                .productServiceCharge("0")
                .successUrl(EsewaUtil.SUCCESS_URL)
                .failureUrl(EsewaUtil.FAILURE_URL)
                .esewaUrl(EsewaUtil.ESEWA_URL)
                .build();
    }

    @Transactional
    public boolean verifyEsewaPayment(String base64Data) {
        try {
            String decodedData = new String(Base64.getDecoder().decode(base64Data));
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map = mapper.readValue(decodedData, new TypeReference<Map<String, Object>>() {});
            
            String transactionUuid = (String) map.get("transaction_uuid");
            String status = (String) map.get("status");
            
            if ("COMPLETE".equals(status)) {
                Optional<Booking> bookingOpt = bookingRepository.findByTransactionUuid(transactionUuid);
                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();
                    booking.setStatus("CONFIRMED");
                    bookingRepository.save(booking);
                    
                    try {
                        User customer = booking.getUser();
                        Event event = booking.getEvent();
                        
                        // Send confirmation to customer
                        emailService.sendBookingConfirmation(customer, booking, event);
                        
                        // Send alert to admin users
                        userRepository.findAll().stream()
                                .filter(u -> u.getRole() == com.example.eventbooking.entity.Role.administrator)
                                .forEach(admin -> emailService.sendAdminBookingAlert(admin, customer, booking, event));
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                    
                    return true;
                }
            } else {
                Optional<Booking> bookingOpt = bookingRepository.findByTransactionUuid(transactionUuid);
                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();
                    booking.setStatus("FAILED");
                    bookingRepository.save(booking);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 60) {
            return minutes + " minutes ago";
        }
        long hours = duration.toHours();
        if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        }
        long days = duration.toDays();
        if (days < 7) {
            return days + (days == 1 ? " day ago" : " days ago");
        }
        long weeks = days / 7;
        return weeks + (weeks == 1 ? " week ago" : " weeks ago");
    }

    @Transactional
    public void cancelBooking(Integer userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You do not own this booking");
        }

        String currentStatus = booking.getStatus().toUpperCase();
        if ("CANCELLED".equals(currentStatus)) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public static String generateTicketCode(Long id) {
        if (id == null) return "BK-UNKNOWN";
        long obfuscated = (id * 2654435761L + 12345L) & 0xFFFFFFFFL;
        String hex = String.format("%08X", obfuscated);
        return "BK-" + hex.substring(0, 4) + "-" + hex.substring(4);
    }
}

