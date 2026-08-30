package com.example.HireHub.controller;


import com.example.HireHub.model.JobPost;
import com.example.HireHub.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class HireHubController {

    private JobPostService service;

    @Autowired
    public void setService(JobPostService service) {
        this.service = service;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPost>> getAllJobs() {
        return new ResponseEntity<>(service.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/jobs/search")
    public ResponseEntity<List<JobPost>> searchByKeyword(@RequestParam String keyword) {
        List<JobPost> jobs = service.searchByKeyword(keyword);

        if (jobs.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/jobs/filter")
    public ResponseEntity<List<JobPost>> filterJobs(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer years) {
        List<JobPost> jobs;

        if (skill != null && years != null) {
            jobs = service.filterByTechStack(skill);
            jobs.retainAll(service.filterByExperience(years));
        } else if (skill != null) {
            jobs = service.filterByTechStack(skill);
        } else if (years != null) {
            jobs = service.filterByExperience(years);
        } else {
            jobs = service.getAllJobs();
        }

        if (jobs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobPost> getJobById(@PathVariable int id) {
        Optional<JobPost> job = service.getJobById(id);

        if (job.isPresent())
            return new ResponseEntity<>(job.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobPost> addJob(@RequestBody JobPost jobPost) {
        try {
            JobPost job = service.addJob(jobPost);
            return new ResponseEntity<>(job, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobPost> updateJob(@RequestBody JobPost jobPost, @PathVariable int id) {
        JobPost updatedJob = service.updateJob(jobPost, id);

        if (updatedJob != null) {
            return new ResponseEntity<>(updatedJob, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable int id) {
        boolean isDeleted = service.deleteJob(id);
        if (isDeleted)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
