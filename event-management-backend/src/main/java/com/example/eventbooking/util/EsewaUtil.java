package com.example.eventbooking.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EsewaUtil {

    public static final String ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    public static final String SECRET_KEY = "8gBm/:&EnhH.1/q";
    public static final String PRODUCT_CODE = "EPAYTEST";
    public static final String SUCCESS_URL = "http://localhost:5173/customer/esewa-success";
    public static final String FAILURE_URL = "http://localhost:5173/customer/esewa-failure";

    public static String generateSignature(String message, String secretKey) {
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
