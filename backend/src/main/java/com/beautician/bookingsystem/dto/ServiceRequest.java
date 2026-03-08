package com.beautician.bookingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceRequest {
    @NotBlank private String serviceName;
    private String description;
    @Positive private Integer durationMinutes;
    @Positive private Double price;
}
