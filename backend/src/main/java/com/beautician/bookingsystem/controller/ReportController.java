package com.beautician.bookingsystem.controller;

import com.beautician.bookingsystem.dto.ReportDTO;
import com.beautician.bookingsystem.dto.ReportRequest;
import com.beautician.bookingsystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.createReport(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportDTO> updateReport(@PathVariable Long id,
                                                    @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.updateReport(id, request));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ReportDTO> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(reportService.getByAppointmentId(appointmentId));
    }
}
