package com.beautician.bookingsystem.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long beauticianId;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;
}
