package com.example.HireHub.service;

import com.example.HireHub.model.JobPost;
import com.example.HireHub.repo.JobPostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<JobPost> getJobById(int id) {

        return repo.findById(id);
    }

    public JobPost addJob(JobPost jobPost) {

        return repo.save(jobPost);
    }

    public JobPost updateJob(JobPost jobPost, int id) {
    Optional<JobPost> existingJob = repo.findById(id);

    if(existingJob.isPresent()) {
        jobPost.setPostId(id);
        return repo.save(jobPost);
    } else {
        return null;
    }
}

    public boolean deleteJob(int id) {
        if(repo.existsById(id))
        {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public List<JobPost> searchByKeyword(String keyword) {

        return repo.searchByKeyword(keyword);
    }
}
