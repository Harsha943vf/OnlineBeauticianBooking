package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.BookingDTO;
import com.beautician.bookingsystem.dto.BookingRequest;
import com.beautician.bookingsystem.service.BookingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/client/{clientId}")
    public ResponseEntity<BookingDTO> createBooking(@PathVariable Long clientId,
                                                     @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(clientId, request));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long bookingId,
                                                     @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, reason));
    }

    @PutMapping("/{bookingId}/reschedule")
    public ResponseEntity<BookingDTO> rescheduleBooking(@PathVariable Long bookingId,
                                                         @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(bookingId, request));
    }

    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<BookingDTO> approveBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.approveBooking(bookingId));
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<BookingDTO> rejectBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.rejectBooking(bookingId));
    }

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<BookingDTO> completeBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.completeBooking(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<BookingDTO>> getClientBookings(@PathVariable Long clientId) {
        return ResponseEntity.ok(bookingService.getClientBookings(clientId));
    }

    @GetMapping("/beautician/{beauticianId}")
    public ResponseEntity<List<BookingDTO>> getBeauticianBookings(@PathVariable Long beauticianId) {
        return ResponseEntity.ok(bookingService.getBeauticianBookings(beauticianId));
    }
}
