package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.ServiceRequestDto;
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

    public List<ServiceRequestDto> getVendorRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Vendor vendor = vendorRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        List<ServiceRequest> requests = serviceRequestRepository.findByServiceVendorIdOrderByCreatedAtDesc(vendor.getId());

        return requests.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ServiceRequestDto updateRequestStatus(Integer requestId, String status, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Vendor vendor = vendorRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        // Ensure the request belongs to a service owned by this vendor
        if (!request.getService().getVendor().getId().equals(vendor.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this service request.");
        }

        request.setStatus(status);
        request = serviceRequestRepository.save(request);

        return convertToDto(request);
    }

    private ServiceRequestDto convertToDto(ServiceRequest request) {
        ServiceRequestDto dto = new ServiceRequestDto();
        dto.setId("REQ-" + String.format("%03d", request.getId()));
        dto.setRawId(request.getId());
        dto.setClient(request.getClient().getFullName());
        dto.setService(request.getService().getServiceName());
        dto.setDate(request.getEventDate());
        dto.setAmount(request.getAmount());
        dto.setStatus(request.getStatus());
        return dto;
    }
}
