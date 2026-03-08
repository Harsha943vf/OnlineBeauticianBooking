package com.beautician.bookingsystem.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportDTO {
    private Long id;
    private Long appointmentId;
    private Double amount;
    private String reportDetails;
    private String createdBy;
    private LocalDate createdDate;
}
