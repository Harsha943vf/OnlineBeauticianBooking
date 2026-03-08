package com.beautician.bookingsystem.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String token;
    private String message;
}
