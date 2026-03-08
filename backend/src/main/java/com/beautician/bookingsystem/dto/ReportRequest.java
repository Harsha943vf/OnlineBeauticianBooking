package com.beautician.bookingsystem.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportRequest {
    private Long appointmentId;
    private Double amount;
    private String reportDetails;
    private String createdBy;
}
