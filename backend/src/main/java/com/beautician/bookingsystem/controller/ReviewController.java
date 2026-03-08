package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.ReviewDTO;
import com.beautician.bookingsystem.dto.ReviewRequest;
import com.beautician.bookingsystem.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/client/{clientId}")
    public ResponseEntity<ReviewDTO> addReview(@PathVariable Long clientId,
                                                @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(clientId, request));
    }

    @GetMapping("/beautician/{beauticianId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByBeautician(@PathVariable Long beauticianId) {
        return ResponseEntity.ok(reviewService.getReviewsByBeautician(beauticianId));
    }
}
