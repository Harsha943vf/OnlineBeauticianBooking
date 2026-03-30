package com.beautician.bookingsystem.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] configuredOrigins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .toArray(String[]::new);

        String[] allowedPatterns = Arrays.copyOf(configuredOrigins, configuredOrigins.length + 2);
        allowedPatterns[configuredOrigins.length] = "http://localhost:*";
        allowedPatterns[configuredOrigins.length + 1] = "http://127.0.0.1:*";

        registry.addMapping("/api/**")
            .allowedOriginPatterns(allowedPatterns)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }
}
