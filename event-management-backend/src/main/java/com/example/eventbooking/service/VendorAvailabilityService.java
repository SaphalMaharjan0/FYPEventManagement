package com.example.eventbooking.service;

import com.example.eventbooking.exception.*;

import com.example.eventbooking.dto.response.VendorAvailabilityDto;
import com.example.eventbooking.dto.response.VendorBlockedDateDto;
import com.example.eventbooking.dto.response.VendorScheduleDto;
import com.example.eventbooking.entity.User;
import com.example.eventbooking.entity.Vendor;
import com.example.eventbooking.entity.VendorAvailability;
import com.example.eventbooking.entity.VendorBlockedDate;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.repository.VendorAvailabilityRepository;
import com.example.eventbooking.repository.VendorBlockedDateRepository;
import com.example.eventbooking.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorAvailabilityService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorAvailabilityRepository availabilityRepository;

    @Autowired
    private VendorBlockedDateRepository blockedDateRepository;

    private static final List<String> DAYS_OF_WEEK = Arrays.asList(
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    );

    @Transactional
    public Vendor getOrCreateVendor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return vendorRepository.findByUserId(user.getUserId())
                .orElseGet(() -> {
                    Vendor newVendor = new Vendor();
                    newVendor.setUser(user);
                    newVendor.setBusinessName(user.getFullName() + "'s Business");
                    return vendorRepository.save(newVendor);
                });
    }

    @Transactional
    public VendorScheduleDto getSchedule(String email) {
        Vendor vendor = getOrCreateVendor(email);

        // Fetch or initialize availability
        List<VendorAvailability> availabilities = availabilityRepository.findByVendorId(vendor.getId());
        if (availabilities.isEmpty()) {
            availabilities = new ArrayList<>();
            for (String day : DAYS_OF_WEEK) {
                VendorAvailability va = new VendorAvailability();
                va.setVendor(vendor);
                va.setDayOfWeek(day);
                // Saturday & Sunday unavailable by default
                if (day.equals("Saturday") || day.equals("Sunday")) {
                    va.setIsAvailable(false);
                } else {
                    va.setIsAvailable(true);
                }
                va.setStartTime(LocalTime.of(9, 0));
                va.setEndTime(LocalTime.of(17, 0));
                availabilities.add(availabilityRepository.save(va));
            }
        }

        // Fetch blocked dates
        List<VendorBlockedDate> blockedDates = blockedDateRepository.findByVendorId(vendor.getId());

        VendorScheduleDto scheduleDto = new VendorScheduleDto();
        scheduleDto.setAvailability(availabilities.stream().map(this::convertToDto).collect(Collectors.toList()));
        scheduleDto.setBlockedDates(blockedDates.stream().map(this::convertToDto).collect(Collectors.toList()));
        return scheduleDto;
    }

    @Transactional
    public VendorScheduleDto updateSchedule(String email, VendorScheduleDto scheduleDto) {
        Vendor vendor = getOrCreateVendor(email);

        // Update working hours
        if (scheduleDto.getAvailability() != null) {
            for (VendorAvailabilityDto dto : scheduleDto.getAvailability()) {
                VendorAvailability va = availabilityRepository.findByVendorIdAndDayOfWeek(vendor.getId(), dto.getDayOfWeek())
                        .orElseGet(() -> {
                            VendorAvailability newVa = new VendorAvailability();
                            newVa.setVendor(vendor);
                            newVa.setDayOfWeek(dto.getDayOfWeek());
                            return newVa;
                        });
                va.setIsAvailable(dto.getIsAvailable());
                if (dto.getStartTime() != null) va.setStartTime(dto.getStartTime());
                if (dto.getEndTime() != null) va.setEndTime(dto.getEndTime());
                availabilityRepository.save(va);
            }
        }

        // Return updated schedule
        return getSchedule(email);
    }

    @Transactional
    public VendorBlockedDateDto addBlockedDate(String email, VendorBlockedDateDto dto) {
        Vendor vendor = getOrCreateVendor(email);

        VendorBlockedDate blockedDate = blockedDateRepository.findByVendorIdAndBlockedDate(vendor.getId(), dto.getBlockedDate())
                .orElseGet(() -> {
                    VendorBlockedDate newBd = new VendorBlockedDate();
                    newBd.setVendor(vendor);
                    newBd.setBlockedDate(dto.getBlockedDate());
                    return newBd;
                });
        blockedDate.setReason(dto.getReason());
        blockedDate = blockedDateRepository.save(blockedDate);
        return convertToDto(blockedDate);
    }

    @Transactional
    public void deleteBlockedDate(String email, LocalDate date) {
        Vendor vendor = getOrCreateVendor(email);
        blockedDateRepository.deleteByVendorIdAndBlockedDate(vendor.getId(), date);
    }

    private VendorAvailabilityDto convertToDto(VendorAvailability va) {
        VendorAvailabilityDto dto = new VendorAvailabilityDto();
        dto.setId(va.getId());
        dto.setDayOfWeek(va.getDayOfWeek());
        dto.setIsAvailable(va.getIsAvailable());
        dto.setStartTime(va.getStartTime());
        dto.setStartTimeStr(va.getStartTime().toString());
        dto.setEndTime(va.getEndTime());
        dto.setEndTimeStr(va.getEndTime().toString());
        return dto;
    }

    private VendorBlockedDateDto convertToDto(VendorBlockedDate bd) {
        VendorBlockedDateDto dto = new VendorBlockedDateDto();
        dto.setId(bd.getId());
        dto.setBlockedDate(bd.getBlockedDate());
        dto.setReason(bd.getReason());
        return dto;
    }
}
