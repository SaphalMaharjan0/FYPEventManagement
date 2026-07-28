package com.example.eventbooking.repository;

import com.example.eventbooking.entity.VendorBlockedDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorBlockedDateRepository extends JpaRepository<VendorBlockedDate, Integer> {
    List<VendorBlockedDate> findByVendorId(Integer vendorId);
    Optional<VendorBlockedDate> findByVendorIdAndBlockedDate(Integer vendorId, LocalDate blockedDate);
    void deleteByVendorIdAndBlockedDate(Integer vendorId, LocalDate blockedDate);
}
