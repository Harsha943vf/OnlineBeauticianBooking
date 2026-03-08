package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.AuthResponse;
import com.beautician.bookingsystem.dto.LoginRequest;
import com.beautician.bookingsystem.dto.RegisterRequest;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.model.enums.Role;
import com.beautician.bookingsystem.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockitoBean private UserService userService;

    @Test
    void register_ValidRequest_Returns200() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser").email("new@test.com")
                .password("password123").role(Role.CLIENT)
                .mobileNumber("1234567890")
                .build();

        AuthResponse mockResponse = AuthResponse.builder()
                .userId(1L).username("newuser").email("new@test.com")
                .role("CLIENT").token("jwt-token")
                .message("Registration successful")
                .build();

        when(userService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void register_DuplicateUsername_Returns400() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("existing").email("new@test.com")
                .password("password123").role(Role.CLIENT)
                .mobileNumber("1234567890")
                .build();

        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new BadRequestException("Username already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_InvalidRequest_Returns400() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("ab").email("invalid-email")
                .password("12345")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_ValidCredentials_Returns200() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("password123");

        AuthResponse mockResponse = AuthResponse.builder()
                .userId(1L).username("testuser").email("test@test.com")
                .role("CLIENT").token("jwt-token")
                .message("Login successful")
                .build();

        when(userService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void login_InvalidCredentials_Returns400() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("wrongpassword");

        when(userService.login(any(LoginRequest.class)))
                .thenThrow(new BadRequestException("Invalid password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_MissingFields_Returns400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
