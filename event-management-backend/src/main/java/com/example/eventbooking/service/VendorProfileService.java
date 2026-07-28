package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.VendorDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendorProfileService {

    @Autowired
    private VendorRepository vendorRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public VendorDto getOrCreateVendorProfile(Integer userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Vendor newVendor = new Vendor();
                    newVendor.setUser(user);
                    newVendor.setBusinessName(user.getFullName() + "'s Business");
                    return vendorRepository.save(newVendor);
                });
        return convertToDto(vendor);
    }

    @Transactional
    public VendorDto updateVendorProfile(Integer userId, VendorDto dto) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        
        if (dto.getBusinessName() != null) vendor.setBusinessName(dto.getBusinessName());
        if (dto.getBusinessDesc() != null) vendor.setBusinessDesc(dto.getBusinessDesc());
        if (dto.getContactEmail() != null) vendor.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) vendor.setContactPhone(dto.getContactPhone());
        if (dto.getBusinessAddress() != null) vendor.setBusinessAddress(dto.getBusinessAddress());
        if (dto.getPayoutMethod() != null) vendor.setPayoutMethod(dto.getPayoutMethod());
        if (dto.getPayoutAccount() != null) vendor.setPayoutAccount(dto.getPayoutAccount());
        
        vendor = vendorRepository.save(vendor);
        return convertToDto(vendor);
    }

    private VendorDto convertToDto(Vendor vendor) {
        VendorDto dto = new VendorDto();
        dto.setId(vendor.getId());
        dto.setUserId(vendor.getUser().getUserId());
        dto.setBusinessName(vendor.getBusinessName());
        dto.setBusinessDesc(vendor.getBusinessDesc());
        dto.setContactEmail(vendor.getContactEmail());
        dto.setContactPhone(vendor.getContactPhone());
        dto.setBusinessAddress(vendor.getBusinessAddress());
        dto.setPayoutMethod(vendor.getPayoutMethod());
        dto.setPayoutAccount(vendor.getPayoutAccount());
        dto.setIsVerified(vendor.getIsVerified());
        return dto;
    }
}
