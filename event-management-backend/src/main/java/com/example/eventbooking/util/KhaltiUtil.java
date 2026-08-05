package com.example.eventbooking.util;

public class KhaltiUtil {
    // Sandbox Endpoints
    public static final String INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
    public static final String LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";
    
    // Replace this with your actual Khalti Sandbox Secret Key
    public static final String SECRET_KEY = "Key c71dd389c90547c1abf8e815610ec87c"; 
    
    public static final String PRODUCT_IDENTITY = "event_ticket";
    public static final String PRODUCT_NAME = "Event Booking Ticket";
    public static final String WEBSITE_URL = "http://localhost:5173";
    public static final String RETURN_URL = "http://localhost:5173/customer/khalti-success";
}