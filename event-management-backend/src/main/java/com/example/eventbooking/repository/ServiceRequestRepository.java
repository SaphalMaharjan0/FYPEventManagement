package com.example.eventbooking.repository;

import com.example.eventbooking.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Integer> {
    
    // Find all service requests for a specific vendor's services
    List<ServiceRequest> findByServiceVendorIdOrderByCreatedAtDesc(Integer vendorId);
}
