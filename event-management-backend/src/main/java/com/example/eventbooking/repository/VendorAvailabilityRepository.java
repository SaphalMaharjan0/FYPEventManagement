package com.example.eventbooking.repository;

import com.example.eventbooking.entity.VendorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorAvailabilityRepository extends JpaRepository<VendorAvailability, Integer> {
    List<VendorAvailability> findByVendorId(Integer vendorId);
    Optional<VendorAvailability> findByVendorIdAndDayOfWeek(Integer vendorId, String dayOfWeek);
}
