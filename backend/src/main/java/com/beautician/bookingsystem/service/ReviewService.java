package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.ReviewDTO;
import com.beautician.bookingsystem.dto.ReviewRequest;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.Beautician;
import com.beautician.bookingsystem.model.Review;
import com.beautician.bookingsystem.model.User;
import com.beautician.bookingsystem.repository.BeauticianRepository;
import com.beautician.bookingsystem.repository.ReviewRepository;
import com.beautician.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BeauticianRepository beauticianRepository;
    private final BookingService bookingService;
    private final BeauticianService beauticianService;

    public ReviewDTO addReview(Long clientId, ReviewRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Beautician beautician = beauticianRepository.findById(request.getBeauticianId())
                .orElseThrow(() -> new ResourceNotFoundException("Beautician not found"));

        // Check if client has a completed booking with this beautician
        if (!bookingService.hasCompletedBooking(clientId, request.getBeauticianId())) {
            throw new BadRequestException("You can only review after a completed booking");
        }

        Review review = Review.builder()
                .client(client)
                .beautician(beautician)
                .rating(request.getRating())
                .reviewText(request.getReviewText())
                .build();

        review = reviewRepository.save(review);

        // Update beautician average rating
        updateBeauticianRating(request.getBeauticianId());

        return toDTO(review);
    }

    public List<ReviewDTO> getReviewsByBeautician(Long beauticianId) {
        return reviewRepository.findByBeauticianId(beauticianId)
                .stream().map(this::toDTO).toList();
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::toDTO).toList();
    }

    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        Long beauticianId = review.getBeautician().getId();
        reviewRepository.deleteById(reviewId);
        updateBeauticianRating(beauticianId);
    }

    private void updateBeauticianRating(Long beauticianId) {
        List<Review> reviews = reviewRepository.findByBeauticianId(beauticianId);
        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        beauticianService.updateRating(beauticianId, Math.round(avg * 10.0) / 10.0);
    }

    private ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .clientId(r.getClient().getId())
                .clientName(r.getClient().getUsername())
                .beauticianId(r.getBeautician().getId())
                .rating(r.getRating())
                .reviewText(r.getReviewText())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
