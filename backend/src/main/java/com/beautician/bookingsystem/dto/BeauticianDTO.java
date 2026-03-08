package com.beautician.bookingsystem.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BeauticianDTO {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String salonName;
    private String specialization;
    private Integer experienceYears;
    private String description;
    private Double ratingAverage;
}
