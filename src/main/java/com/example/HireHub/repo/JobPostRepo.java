package com.example.HireHub.repo;

import com.example.HireHub.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface JobPostRepo extends JpaRepository<JobPost,Integer> {
}
