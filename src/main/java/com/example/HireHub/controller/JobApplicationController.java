package com.example.HireHub.controller;

import com.example.HireHub.model.JobApplication;
import com.example.HireHub.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @PostMapping("/jobs/{id}/apply")
    public ResponseEntity<?> applyForJob(@PathVariable Integer id, Authentication auth) {
        String username = auth.getName();
        try {
            JobApplication app = applicationService.apply(id, username);
            return new ResponseEntity<>(app, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/jobs/{id}/applied")
    public ResponseEntity<Map<String, Boolean>> checkApplied(@PathVariable Integer id, Authentication auth) {
        boolean applied = applicationService.hasApplied(id, auth.getName());
        return ResponseEntity.ok(Map.of("applied", applied));
    }

    @GetMapping("/jobs/{id}/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(@PathVariable Integer id) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(id));
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(auth.getName()));
    }
}
