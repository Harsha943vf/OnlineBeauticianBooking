package com.beautician.bookingsystem.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Value("${spring.datasource.url:NOT_SET}")
    private String dbUrl;

    @Value("${spring.datasource.username:NOT_SET}")
    private String dbUser;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("profile", activeProfile);
        info.put("dbHost", System.getenv("MYSQLHOST") != null ? "SET" : "NOT_SET");
        info.put("dbPort", System.getenv("MYSQLPORT") != null ? System.getenv("MYSQLPORT") : "NOT_SET");
        info.put("dbName", System.getenv("MYSQLDATABASE") != null ? "SET" : "NOT_SET");
        info.put("dbUser", System.getenv("MYSQLUSER") != null ? "SET" : "NOT_SET");
        info.put("dbPass", System.getenv("MYSQLPASSWORD") != null ? "SET" : "NOT_SET");
        info.put("port", System.getenv("PORT") != null ? System.getenv("PORT") : "NOT_SET");
        return ResponseEntity.ok(info);
    }
}
