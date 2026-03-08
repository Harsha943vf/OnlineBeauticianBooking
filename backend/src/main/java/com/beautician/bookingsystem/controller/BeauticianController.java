package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.BeauticianDTO;
import com.beautician.bookingsystem.dto.BeauticianRequest;
import com.beautician.bookingsystem.service.BeauticianService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beauticians")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BeauticianController {

    private final BeauticianService beauticianService;

    @PostMapping("/{userId}")
    public ResponseEntity<BeauticianDTO> createProfile(@PathVariable Long userId,
                                                        @RequestBody BeauticianRequest request) {
        return ResponseEntity.ok(beauticianService.createProfile(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BeauticianDTO> updateProfile(@PathVariable Long id,
                                                        @RequestBody BeauticianRequest request) {
        return ResponseEntity.ok(beauticianService.updateProfile(id, request));
    }

    @GetMapping
    public ResponseEntity<List<BeauticianDTO>> getAllBeauticians() {
        return ResponseEntity.ok(beauticianService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeauticianDTO> getBeautician(@PathVariable Long id) {
        return ResponseEntity.ok(beauticianService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<BeauticianDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(beauticianService.getByUserId(userId));
    }
}
