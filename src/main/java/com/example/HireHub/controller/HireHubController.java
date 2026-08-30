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

    @GetMapping("/Jobs")
    public ResponseEntity<List<JobPost>> getAllJobs() {
        return new ResponseEntity<>(service.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/Job/{id}")
    public ResponseEntity<JobPost> getJobById(@PathVariable("id") int id) {
        Optional<JobPost> job = service.getJobById(id);

        if (job.isPresent())
            return new ResponseEntity<>(job.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/Job")
    public ResponseEntity<JobPost> addJob(@RequestBody JobPost jobPost) {
        try {
            JobPost job = service.addJob(jobPost);
            return new ResponseEntity<>(job, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/Job/{id}")
    public ResponseEntity<JobPost> updateJob(@RequestBody JobPost jobPost, @PathVariable("id") int id) {
        JobPost updatedJob = service.updateJob(jobPost, id);

        if (updatedJob != null) {
            return new ResponseEntity<>(updatedJob, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/Job/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") int id) {
        boolean isDeleted = service.deleteJob(id);
        if (isDeleted)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @GetMapping("/Job/search")
    public ResponseEntity<List<JobPost>> searchByKeyword(@RequestParam("keyword") String keyword) {
        List<JobPost> jobs = service.searchByKeyword(keyword);

        if (jobs.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/Job/tech")
    public ResponseEntity<List<JobPost>> getJobsByTechStack(@RequestParam("skill") String skill) {
        List<JobPost> jobs = service.filterByTechStack(skill);

        if (jobs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/Job/experience/{years}")
    public ResponseEntity<List<JobPost>> getJobsByExperience(@PathVariable("years") int years) {
        List<JobPost> jobs = service.filterByExperience(years);

        if (jobs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

}
