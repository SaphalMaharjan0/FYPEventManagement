package com.example.eventbooking.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class EsewaUtil {

    public final String ESEWA_URL = "http://localhost:5173/customer/mock-esewa";
    
    @Value("${payment.esewa.secret-key}")
    public String SECRET_KEY;
    
    public final String PRODUCT_CODE = "EPAYTEST";
    public final String SUCCESS_URL = "http://localhost:5173/customer/esewa-success";
    public final String FAILURE_URL = "http://localhost:5173/customer/esewa-failure";

    public String generateSignature(String message, String secretKey) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            
            byte[] hash = sha256_HMAC.doFinal(message.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error while generating eSewa signature", e);
        }
    }
}
