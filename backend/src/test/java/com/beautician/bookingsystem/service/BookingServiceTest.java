package com.beautician.bookingsystem.service;

import com.beautician.bookingsystem.dto.BookingDTO;
import com.beautician.bookingsystem.dto.BookingRequest;
import com.beautician.bookingsystem.exception.BadRequestException;
import com.beautician.bookingsystem.exception.ResourceNotFoundException;
import com.beautician.bookingsystem.model.*;
import com.beautician.bookingsystem.model.enums.BookingStatus;
import com.beautician.bookingsystem.model.enums.Role;
import com.beautician.bookingsystem.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private BeauticianRepository beauticianRepository;
    @Mock private BeautyServiceRepository serviceRepository;
    @Mock private EmailService emailService;
    @InjectMocks private BookingService bookingService;

    private User client;
    private Beautician beautician;
    private BeautyService beautyService;
    private Booking booking;
    private BookingRequest bookingRequest;

    @BeforeEach
    void setUp() {
        client = User.builder()
                .id(1L).username("client1").email("client@test.com")
                .password("encoded").role(Role.CLIENT).active(true)
                .mobileNumber("1234567890")
                .build();

        User beauticianUser = User.builder()
                .id(2L).username("beautician1").email("beautician@test.com")
                .password("encoded").role(Role.BEAUTICIAN).active(true)
                .build();

        beautician = Beautician.builder()
                .id(1L).user(beauticianUser)
                .salonName("Test Salon").specialization("Hair")
                .experienceYears(5).ratingAverage(4.5)
                .build();

        beautyService = BeautyService.builder()
                .id(1L).beautician(beautician)
                .serviceName("Haircut").price(50.0).durationMinutes(30)
                .build();

        booking = Booking.builder()
                .id(1L).client(client).beautician(beautician).service(beautyService)
                .bookingDate(LocalDate.of(2025, 8, 15))
                .bookingTime(LocalTime.of(10, 0))
                .status(BookingStatus.PENDING)
                .clientPhone("1234567890")
                .build();

        bookingRequest = BookingRequest.builder()
                .beauticianId(1L).serviceId(1L)
                .bookingDate(LocalDate.of(2025, 8, 15))
                .bookingTime(LocalTime.of(10, 0))
                .notes("Test booking")
                .build();
    }

    @Test
    void createBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(beauticianRepository.findById(1L)).thenReturn(Optional.of(beautician));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(beautyService));
        when(bookingRepository.existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                eq(1L), any(), any(), eq(BookingStatus.CANCELLED))).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(1L);
            return b;
        });

        BookingDTO result = bookingService.createBooking(1L, bookingRequest);

        assertNotNull(result);
        assertEquals(1L, result.getClientId());
        assertEquals("client1", result.getClientName());
        assertEquals(1L, result.getBeauticianId());
        assertEquals("Haircut", result.getServiceName());
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_ConflictingSlot_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(beauticianRepository.findById(1L)).thenReturn(Optional.of(beautician));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(beautyService));
        when(bookingRepository.existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                eq(1L), any(), any(), eq(BookingStatus.CANCELLED))).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> bookingService.createBooking(1L, bookingRequest));
        assertEquals("This time slot is already booked", ex.getMessage());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_ClientNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> bookingService.createBooking(99L, bookingRequest));
    }

    @Test
    void createBooking_BeauticianNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(beauticianRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> bookingService.createBooking(1L, bookingRequest));
    }

    @Test
    void cancelBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingDTO result = bookingService.cancelBooking(1L, "Not available");

        assertEquals(BookingStatus.CANCELLED, result.getStatus());
        assertEquals("Not available", result.getCancellationReason());
    }

    @Test
    void cancelBooking_CompletedBooking_ThrowsException() {
        booking.setStatus(BookingStatus.COMPLETED);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> bookingService.cancelBooking(1L, "reason"));
        assertEquals("Cannot cancel a completed booking", ex.getMessage());
    }

    @Test
    void cancelBooking_NotFound_ThrowsException() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> bookingService.cancelBooking(99L, "reason"));
    }

    @Test
    void rescheduleBooking_Success() {
        BookingRequest rescheduleReq = BookingRequest.builder()
                .bookingDate(LocalDate.of(2025, 8, 20))
                .bookingTime(LocalTime.of(14, 0))
                .build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                eq(1L), any(), any(), eq(BookingStatus.CANCELLED))).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingDTO result = bookingService.rescheduleBooking(1L, rescheduleReq);

        assertEquals(LocalDate.of(2025, 8, 20), result.getBookingDate());
        assertEquals(LocalTime.of(14, 0), result.getBookingTime());
        assertEquals(BookingStatus.PENDING, result.getStatus());
    }

    @Test
    void rescheduleBooking_ConflictingSlot_ThrowsException() {
        BookingRequest rescheduleReq = BookingRequest.builder()
                .bookingDate(LocalDate.of(2025, 8, 20))
                .bookingTime(LocalTime.of(14, 0))
                .build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.existsByBeauticianIdAndBookingDateAndBookingTimeAndStatusNot(
                eq(1L), any(), any(), eq(BookingStatus.CANCELLED))).thenReturn(true);

        assertThrows(BadRequestException.class,
                () -> bookingService.rescheduleBooking(1L, rescheduleReq));
    }

    @Test
    void approveBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingDTO result = bookingService.approveBooking(1L);

        assertEquals(BookingStatus.APPROVED, result.getStatus());
    }

    @Test
    void completeBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingDTO result = bookingService.completeBooking(1L);

        assertEquals(BookingStatus.COMPLETED, result.getStatus());
    }

    @Test
    void getClientBookings_ReturnsList() {
        when(bookingRepository.findByClientId(1L)).thenReturn(List.of(booking));

        List<BookingDTO> results = bookingService.getClientBookings(1L);

        assertEquals(1, results.size());
        assertEquals("client1", results.get(0).getClientName());
    }

    @Test
    void getBeauticianBookings_ReturnsList() {
        when(bookingRepository.findByBeauticianId(1L)).thenReturn(List.of(booking));

        List<BookingDTO> results = bookingService.getBeauticianBookings(1L);

        assertEquals(1, results.size());
        assertEquals("beautician1", results.get(0).getBeauticianName());
    }

    @Test
    void hasCompletedBooking_ReturnsTrue() {
        Booking completedBooking = Booking.builder()
                .id(2L).client(client).beautician(beautician).service(beautyService)
                .status(BookingStatus.COMPLETED).build();
        when(bookingRepository.findByClientIdAndBeauticianIdAndStatus(1L, 1L, BookingStatus.COMPLETED))
                .thenReturn(List.of(completedBooking));

        assertTrue(bookingService.hasCompletedBooking(1L, 1L));
    }

    @Test
    void hasCompletedBooking_ReturnsFalse() {
        when(bookingRepository.findByClientIdAndBeauticianIdAndStatus(1L, 1L, BookingStatus.COMPLETED))
                .thenReturn(List.of());

        assertFalse(bookingService.hasCompletedBooking(1L, 1L));
    }
}
