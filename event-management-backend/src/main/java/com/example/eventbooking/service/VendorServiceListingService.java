package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.ServiceDto;
import com.example.eventbooking.entity.Service;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.repository.ServiceRepository;
import com.example.eventbooking.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class VendorServiceListingService {

    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public List<ServiceDto> getServicesByUserId(Integer userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        return serviceRepository.findByVendorId(vendor.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceDto createService(Integer userId, ServiceDto dto) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        
        Service service = new Service();
        service.setVendor(vendor);
        service.setServiceName(dto.getServiceName());
        service.setDescription(dto.getDescription());
        service.setCategory(dto.getCategory());
        service.setPrice(dto.getPrice());
        if (dto.getIsActive() != null) {
            service.setIsActive(dto.getIsActive());
        }
        if (dto.getImageUrl() != null) {
            service.setImageUrl(dto.getImageUrl());
        }
        
        service = serviceRepository.save(service);
        return convertToDto(service);
    }

    @Transactional
    public void deleteService(Integer userId, Integer serviceId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        if (!service.getVendor().getId().equals(vendor.getId())) {
            throw new RuntimeException("Unauthorized to delete this service");
        }
        
        serviceRepository.delete(service);
    }

    @Transactional
    public ServiceDto updateService(Integer userId, Integer serviceId, ServiceDto dto) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        if (!service.getVendor().getId().equals(vendor.getId())) {
            throw new RuntimeException("Unauthorized to update this service");
        }

        if (dto.getServiceName() != null) service.setServiceName(dto.getServiceName());
        if (dto.getDescription() != null) service.setDescription(dto.getDescription());
        if (dto.getCategory() != null) service.setCategory(dto.getCategory());
        if (dto.getPrice() != null) service.setPrice(dto.getPrice());
        if (dto.getIsActive() != null) service.setIsActive(dto.getIsActive());
        if (dto.getImageUrl() != null) service.setImageUrl(dto.getImageUrl());

        service = serviceRepository.save(service);
        return convertToDto(service);
    }

    private ServiceDto convertToDto(Service service) {
        ServiceDto dto = new ServiceDto();
        dto.setId(service.getId());
        dto.setVendorId(service.getVendor().getId());
        dto.setServiceName(service.getServiceName());
        dto.setDescription(service.getDescription());
        dto.setCategory(service.getCategory());
        dto.setPrice(service.getPrice());
        dto.setIsActive(service.getIsActive());
        dto.setImageUrl(service.getImageUrl());
        return dto;
    }
}
