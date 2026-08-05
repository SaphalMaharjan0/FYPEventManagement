package com.example.eventbooking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KhaltiInitiateResponse {
    private String pidx;
    private String paymentUrl;
    
    // For mock implementation
    private String amount;
    private String purchaseOrderId;
    private String purchaseOrderName;
    private String customerInfo;
}
