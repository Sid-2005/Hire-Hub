package com.example.HireHub.controller;


import com.example.HireHub.model.JobPost;
import com.example.HireHub.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HireHubController {

    private JobPostService service;

    @Autowired
    public void setService(JobPostService service) {
        this.service = service;
    }

    @GetMapping("/Jobs")
    public List<JobPost> getAllJobs()
    {
        return service.getAllJobs();
    }

}
