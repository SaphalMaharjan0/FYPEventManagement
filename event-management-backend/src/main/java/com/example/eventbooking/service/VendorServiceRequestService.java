package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

import com.example.eventbooking.dto.response.ServiceRequestDto;
import com.example.eventbooking.entity.Event;
import com.example.eventbooking.entity.ServiceRequest;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.repository.ServiceRequestRepository;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final NotificationService notificationService;

    public List<ServiceRequestDto> getVendorRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Auto-create vendor profile if it doesn't exist yet (first login)
        Vendor vendor = vendorRepository.findByUserId(user.getUserId())
                .orElseGet(() -> {
                    Vendor newVendor = new Vendor();
                    newVendor.setUser(user);
                    newVendor.setBusinessName(user.getFullName() + "'s Business");
                    return vendorRepository.save(newVendor);
                });

        List<ServiceRequest> requests = serviceRequestRepository.findByServiceVendorIdOrderByCreatedAtDesc(vendor.getId());

        return requests.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ServiceRequestDto updateRequestStatus(Integer requestId, String status, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Vendor vendor = vendorRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found"));

        // Ensure the request belongs to a service owned by this vendor
        if (!request.getService().getVendor().getId().equals(vendor.getId())) {
            throw new UnauthorizedException("Unauthorized: You do not own this service request.");
        }

        String dbStatus = status;
        if ("Pending".equalsIgnoreCase(status) || "requested".equalsIgnoreCase(status)) {
            dbStatus = "requested";
        } else if ("Active".equalsIgnoreCase(status) || "accepted".equalsIgnoreCase(status)) {
            dbStatus = "accepted";
        } else if ("Completed".equalsIgnoreCase(status)) {
            dbStatus = "completed";
        } else if ("Rejected".equalsIgnoreCase(status)) {
            dbStatus = "rejected";
        }

        request.setStatus(dbStatus);
        request = serviceRequestRepository.save(request);

        // --- Send notifications based on status change ---
        String vendorName = vendor.getBusinessName();
        String serviceName = request.getService().getServiceName();
        Event event = request.getEvent();
        String eventTitle = event != null ? event.getTitle() : "Unknown Event";
        Integer eventId = event != null ? event.getEventId() : null;

        if ("rejected".equals(dbStatus)) {
            // Notify the event organizer
            if (event != null && event.getOrganizer() != null) {
                notificationService.createNotification(
                        event.getOrganizer(),
                        "Service Rejected",
                        "Vendor \"" + vendorName + "\" rejected the service \"" + serviceName
                                + "\" for event \"" + eventTitle + "\". Please reassign a replacement vendor.",
                        "SERVICE_REJECTED",
                        eventId,
                        request.getId()
                );
            }
        } else if ("accepted".equals(dbStatus)) {
            // Notify the event organizer
            if (event != null && event.getOrganizer() != null) {
                notificationService.createNotification(
                        event.getOrganizer(),
                        "Service Accepted",
                        "Vendor \"" + vendorName + "\" accepted the service \"" + serviceName
                                + "\" for event \"" + eventTitle + "\".",
                        "SERVICE_ACCEPTED",
                        eventId,
                        request.getId()
                );
            }
        } else if ("completed".equals(dbStatus)) {
            // Notify the event organizer
            if (event != null && event.getOrganizer() != null) {
                notificationService.createNotification(
                        event.getOrganizer(),
                        "Service Completed",
                        "Vendor \"" + vendorName + "\" has completed the service \"" + serviceName
                                + "\" for event \"" + eventTitle + "\".",
                        "SERVICE_COMPLETED",
                        eventId,
                        request.getId()
                );
            }
        }

        return convertToDto(request);
    }

    private ServiceRequestDto convertToDto(ServiceRequest request) {
        ServiceRequestDto dto = new ServiceRequestDto();
        dto.setId("REQ-" + String.format("%03d", request.getId()));
        dto.setRawId(request.getId());
        dto.setClient(request.getClient().getFullName());
        dto.setEventTitle(request.getEvent() != null ? request.getEvent().getTitle() : "Unknown Event");
        dto.setService(request.getService().getServiceName());
        dto.setDate(request.getEventDate());
        dto.setAmount(request.getAmount());
        
        String feStatus = request.getStatus();
        if ("requested".equalsIgnoreCase(feStatus)) {
            feStatus = "Pending";
        } else if ("accepted".equalsIgnoreCase(feStatus)) {
            feStatus = "Active";
        } else if ("completed".equalsIgnoreCase(feStatus)) {
            feStatus = "Completed";
        } else if ("rejected".equalsIgnoreCase(feStatus)) {
            feStatus = "Rejected";
        }
        dto.setStatus(feStatus);

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
}
