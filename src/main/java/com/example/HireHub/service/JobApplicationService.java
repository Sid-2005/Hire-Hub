package com.example.HireHub.service;

import com.example.HireHub.model.JobApplication;
import com.example.HireHub.model.JobPost;
import com.example.HireHub.repo.JobApplicationRepo;
import com.example.HireHub.repo.JobPostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepo applicationRepo;

    @Autowired
    private JobPostRepo jobPostRepo;

    public JobApplication apply(Integer jobPostId, String username) {
        Optional<JobPost> jobOpt = jobPostRepo.findById(jobPostId);
        if (jobOpt.isEmpty()) {
            throw new IllegalArgumentException("Job not found with id: " + jobPostId);
        }

        if (applicationRepo.existsByJobPostIdAndUsername(jobPostId, username)) {
            throw new IllegalStateException("You have already applied for this job.");
        }

        JobApplication app = new JobApplication();
        app.setJobPostId(jobPostId);
        app.setJobProfile(jobOpt.get().getPostProfile());
        app.setUsername(username);

        return applicationRepo.save(app);
    }

    public List<JobApplication> getApplicationsForJob(Integer jobPostId) {
        return applicationRepo.findByJobPostId(jobPostId);
    }

    public List<JobApplication> getAllApplications() {
        return applicationRepo.findAll();
    }

    public List<JobApplication> getApplicationsByUser(String username) {
        return applicationRepo.findByUsername(username);
    }

    public boolean hasApplied(Integer jobPostId, String username) {
        return applicationRepo.existsByJobPostIdAndUsername(jobPostId, username);
    }

    public long countApplicants(Integer jobPostId) {
        return applicationRepo.countByJobPostId(jobPostId);
    }
}
