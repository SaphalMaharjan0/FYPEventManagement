package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

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

import com.example.eventbooking.dto.request.KhaltiInitiateRequest;
import com.example.eventbooking.dto.response.KhaltiInitiateResponse;
import com.example.eventbooking.util.KhaltiUtil;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CustomerService {

    private final BookingRepository bookingRepository;
    private final FavoriteRepository favoriteRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final com.example.eventbooking.repository.TicketRepository ticketRepository;
    private final EsewaUtil esewaUtil;
    private final KhaltiUtil khaltiUtil;
    private final NotificationService notificationService;
    private final EventService eventService;

    @Autowired
    public CustomerService(BookingRepository bookingRepository,
                           FavoriteRepository favoriteRepository,
                           EventRepository eventRepository,
                           UserRepository userRepository,
                           EmailService emailService,
                           com.example.eventbooking.repository.TicketRepository ticketRepository,
                           EsewaUtil esewaUtil,
                           KhaltiUtil khaltiUtil,
                           NotificationService notificationService,
                           EventService eventService) {
        this.bookingRepository = bookingRepository;
        this.favoriteRepository = favoriteRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.ticketRepository = ticketRepository;
        this.esewaUtil = esewaUtil;
        this.khaltiUtil = khaltiUtil;
        this.notificationService = notificationService;
        this.eventService = eventService;
    }

    @Transactional
    public boolean toggleFavorite(Integer userId, Integer eventId) {
        Optional<Favorite> existingFavorite = favoriteRepository.findByUser_UserIdAndEvent_EventId(userId, eventId);
        
        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return false; // returned false means un-favorited
        } else {
            User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Event event = eventRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event not found"));
            
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .event(event)
                    .build();
            favoriteRepository.save(favorite);
            return true; // returned true means favorited
        }
    }

    @Transactional(readOnly = true)
    public List<com.example.eventbooking.dto.response.EventDto> getFavoriteEvents(Integer userId) {
        return favoriteRepository.findByUser_UserId(userId).stream()
                .map(Favorite::getEvent)
                .map(eventService::mapToDto)
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
                        .eventId(b.getEvent() != null ? b.getEvent().getEventId() : null)
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
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(request.getEventId()).orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        int bookedTickets = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(Booking::getTicketCount)
                .sum();
        com.example.eventbooking.entity.Ticket ticket = ticketRepository.findByEventEventId(event.getEventId()).stream().findFirst().orElse(null);

        if (ticket == null) {
            ticket = com.example.eventbooking.entity.Ticket.builder()
                    .event(event)
                    .ticketType("General Admission")
                    .price(BigDecimal.valueOf(50.0))
                    .quantityAvailable(event.getCapacity())
                    .quantitySold(bookedTickets)
                    .build();
            ticket = ticketRepository.save(ticket);
        }

        int seatsLeft = ticket.getQuantityAvailable() - ticket.getQuantitySold();

        if (seatsLeft < request.getQuantity()) {
            throw new BadRequestException("Not enough seats available");
        }

        BigDecimal price = ticket.getPrice();
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(request.getQuantity()));

        String transactionUuid = UUID.randomUUID().toString();

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .ticket(ticket)
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
        String message = "total_amount=" + amountStr + ",transaction_uuid=" + transactionUuid + ",product_code=" + esewaUtil.PRODUCT_CODE;
        String signature = esewaUtil.generateSignature(message, esewaUtil.SECRET_KEY);

        return EsewaInitiateResponse.builder()
                .amount(amountStr)
                .taxAmount("0")
                .totalAmount(amountStr)
                .transactionUuid(transactionUuid)
                .productCode(esewaUtil.PRODUCT_CODE)
                .productDeliveryCharge("0")
                .productServiceCharge("0")
                .successUrl(esewaUtil.SUCCESS_URL)
                .failureUrl(esewaUtil.FAILURE_URL)
                .esewaUrl(esewaUtil.ESEWA_URL)
                .signature(signature)
                .signedFieldNames(signedFieldNames)
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
                        
                        if (booking.getTicket() != null) {
                            com.example.eventbooking.entity.Ticket ticket = booking.getTicket();
                            ticket.setQuantitySold(ticket.getQuantitySold() + booking.getTicketCount());
                            ticketRepository.save(ticket);
                        }
                        
                        emailService.sendBookingConfirmation(customer, booking, event);
                        
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

    @Transactional
    public KhaltiInitiateResponse initiateKhaltiBooking(Integer userId, KhaltiInitiateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(request.getEventId()).orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        int bookedTickets = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(Booking::getTicketCount)
                .sum();
        com.example.eventbooking.entity.Ticket ticket = ticketRepository.findByEventEventId(event.getEventId()).stream().findFirst().orElse(null);

        if (ticket == null) {
            ticket = com.example.eventbooking.entity.Ticket.builder()
                    .event(event)
                    .ticketType("General Admission")
                    .price(BigDecimal.valueOf(50.0))
                    .quantityAvailable(event.getCapacity())
                    .quantitySold(bookedTickets)
                    .build();
            ticket = ticketRepository.save(ticket);
        }

        int seatsLeft = ticket.getQuantityAvailable() - ticket.getQuantitySold();

        if (seatsLeft < request.getQuantity()) {
            throw new BadRequestException("Not enough seats available");
        }

        BigDecimal price = ticket.getPrice();
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(request.getQuantity()));
        String transactionUuid = UUID.randomUUID().toString();

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .ticket(ticket)
                .ticketCount(request.getQuantity())
                .amount(totalAmount)
                .status("PENDING")
                .bookingDate(LocalDateTime.now())
                .transactionUuid(transactionUuid)
                .paymentMethod("Khalti")
                .build();

        bookingRepository.save(booking);

        long amountInPaisa = totalAmount.multiply(BigDecimal.valueOf(100)).longValue();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Key " + khaltiUtil.SECRET_KEY);

        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("return_url", khaltiUtil.RETURN_URL);
        payload.put("website_url", khaltiUtil.WEBSITE_URL);
        payload.put("amount", amountInPaisa);
        payload.put("purchase_order_id", booking.getId().toString());
        payload.put("purchase_order_name", khaltiUtil.PRODUCT_NAME);
        
        Map<String, Object> customerInfo = new java.util.HashMap<>();
        customerInfo.put("name", user.getFullName());
        customerInfo.put("email", user.getEmail());
        customerInfo.put("phone", user.getPhone() != null ? user.getPhone() : "9800000000");
        payload.put("customer_info", customerInfo);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(khaltiUtil.INITIATE_URL, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String pidx = (String) response.getBody().get("pidx");
                String paymentUrl = (String) response.getBody().get("payment_url");
                
                booking.setTransactionUuid(pidx);
                bookingRepository.save(booking);
                
                return KhaltiInitiateResponse.builder()
                        .pidx(pidx)
                        .paymentUrl(paymentUrl)
                        .build();
            } else {
                throw new RuntimeException("Invalid response from Khalti API");
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("Khalti API Error Status: " + e.getStatusCode());
            System.err.println("Khalti API Error Body: " + e.getResponseBodyAsString());
            
            // Fallback to mock Khalti payment if sandbox key is invalid or API fails
            String mockPidx = "mock_" + java.util.UUID.randomUUID().toString().substring(0, 8);
            String mockPaymentUrl = khaltiUtil.WEBSITE_URL + "/customer/mock-khalti?pidx=" + mockPidx + "&amount=" + amountInPaisa;
            booking.setTransactionUuid(mockPidx);
            bookingRepository.save(booking);
            return KhaltiInitiateResponse.builder().pidx(mockPidx).paymentUrl(mockPaymentUrl).build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to connect to Khalti API", e);
        }
    }

    @Transactional
    public boolean verifyKhaltiPayment(String pidx, String amount) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findByTransactionUuid(pidx);
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Key " + khaltiUtil.SECRET_KEY);
                
                Map<String, Object> payload = new java.util.HashMap<>();
                payload.put("pidx", pidx);
                
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                if (pidx.startsWith("mock_")) {
                    // Handle mock Khalti payments for sandbox testing without valid keys
                    booking.setStatus("CONFIRMED");
                    bookingRepository.save(booking);
                } else {
                    ResponseEntity<Map> response = restTemplate.postForEntity(khaltiUtil.LOOKUP_URL, entity, Map.class);
                    Map<String, Object> responseBody = response.getBody();

                    if (responseBody != null && "Completed".equalsIgnoreCase((String) responseBody.get("status"))) {
                        booking.setStatus("CONFIRMED");
                        bookingRepository.save(booking);
                    } else {
                        return false;
                    }
                }
                
                if ("CONFIRMED".equals(booking.getStatus())) {

                    try {
                        User customer = booking.getUser();
                        Event event = booking.getEvent();
                        
                        if (booking.getTicket() != null) {
                            com.example.eventbooking.entity.Ticket ticket = booking.getTicket();
                            ticket.setQuantitySold(ticket.getQuantitySold() + booking.getTicketCount());
                            ticketRepository.save(ticket);
                        }
                        
                        emailService.sendBookingConfirmation(customer, booking, event);
                        userRepository.findAll().stream()
                                .filter(u -> u.getRole() == com.example.eventbooking.entity.Role.administrator)
                                .forEach(admin -> emailService.sendAdminBookingAlert(admin, customer, booking, event));
                                
                        notificationService.createNotification(customer, "Booking Confirmed", 
                                "Your booking for " + event.getTitle() + " has been confirmed.", "BOOKING_UPDATE", event.getEventId(), null);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return true;
                } else {
                    booking.setStatus("FAILED");
                    bookingRepository.save(booking);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Transactional
    public boolean processCashBooking(Integer userId, Integer eventId, Integer quantity) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        int bookedTickets = bookingRepository.findByEvent_EventId(event.getEventId()).stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .mapToInt(Booking::getTicketCount)
                .sum();
        com.example.eventbooking.entity.Ticket ticket = ticketRepository.findByEventEventId(event.getEventId()).stream().findFirst().orElse(null);

        if (ticket == null) {
            ticket = com.example.eventbooking.entity.Ticket.builder()
                    .event(event)
                    .ticketType("General Admission")
                    .price(BigDecimal.valueOf(50.0))
                    .quantityAvailable(event.getCapacity())
                    .quantitySold(bookedTickets)
                    .build();
            ticket = ticketRepository.save(ticket);
        }

        int seatsLeft = ticket.getQuantityAvailable() - ticket.getQuantitySold();

        if (seatsLeft < quantity) {
            throw new BadRequestException("Not enough seats available");
        }

        BigDecimal price = ticket.getPrice();
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(quantity));
        String transactionUuid = UUID.randomUUID().toString();

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .ticket(ticket)
                .ticketCount(quantity)
                .amount(totalAmount)
                .status("PENDING") // Cash payments are pending until paid
                .bookingDate(LocalDateTime.now())
                .transactionUuid(transactionUuid)
                .paymentMethod("Cash")
                .build();

        bookingRepository.save(booking);

        // We can update the tickets sold right away to reserve the spot
        try {
            ticket.setQuantitySold(ticket.getQuantitySold() + quantity);
            ticketRepository.save(ticket);

            emailService.sendBookingConfirmation(user, booking, event);
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == com.example.eventbooking.entity.Role.administrator)
                    .forEach(admin -> emailService.sendAdminBookingAlert(admin, user, booking, event));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return true;
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
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized: You do not own this booking");
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

