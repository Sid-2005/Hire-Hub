package com.example.HireHub.controller;


import com.example.HireHub.model.JobPost;
import com.example.HireHub.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            return new ResponseEntity<>(job.get(),HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);


    }

}
