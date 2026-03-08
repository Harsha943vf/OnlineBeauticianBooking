package com.beautician.bookingsystem.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceDTO {
    private Long id;
    private Long beauticianId;
    private String beauticianName;
    private String serviceName;
    private String description;
    private Integer durationMinutes;
    private Double price;
}
