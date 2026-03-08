package com.beautician.bookingsystem.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BeauticianRequest {
    private String salonName;
    private String specialization;
    private Integer experienceYears;
    private String description;
}
