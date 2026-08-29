package com.example.HireHub.service;

import com.example.HireHub.model.JobPost;
import com.example.HireHub.repo.JobPostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostService {


    private JobPostRepo repo;

    @Autowired
    public void setRepo(JobPostRepo repo) {
        this.repo = repo;
    }

    public List<JobPost> getAllJobs() {

        return repo.findAll();
    }
}
