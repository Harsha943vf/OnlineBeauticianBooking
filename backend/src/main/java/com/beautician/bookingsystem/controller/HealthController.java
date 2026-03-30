package com.beautician.bookingsystem.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("service", "booking-system");
        info.put("profile", activeProfile);
        info.put("time", Instant.now().toString());
        return ResponseEntity.ok(info);
    }
}
