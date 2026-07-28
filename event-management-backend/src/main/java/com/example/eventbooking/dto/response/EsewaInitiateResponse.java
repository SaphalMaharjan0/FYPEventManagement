package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EsewaInitiateResponse {
    private String signature;
    private String signedFieldNames;
    private String transactionUuid;
    private String amount;
    private String taxAmount;
    private String totalAmount;
    private String productCode;
    private String productDeliveryCharge;
    private String productServiceCharge;
    private String successUrl;
    private String failureUrl;
    private String esewaUrl;
}
