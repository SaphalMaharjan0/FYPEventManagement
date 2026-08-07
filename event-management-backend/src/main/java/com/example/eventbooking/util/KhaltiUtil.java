package com.example.eventbooking.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KhaltiUtil {
    // Sandbox Endpoints
    public final String INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
    public final String LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";
    
    @Value("${payment.khalti.secret-key}")
    public String SECRET_KEY; 
    
    public final String PRODUCT_IDENTITY = "event_ticket";
    public final String PRODUCT_NAME = "Event Booking Ticket";
    public final String WEBSITE_URL = "http://localhost:5173";
    public final String RETURN_URL = "http://localhost:5173/customer/khalti-success";
}