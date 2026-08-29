package com.example.HireHub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_post_seq")
    @SequenceGenerator(name = "job_post_seq", sequenceName = "job_post_seq", initialValue = 1, allocationSize = 1)
    private Integer postId;

    private String postProfile;
    private String postDesc;
    private int reqExperience;

    @ElementCollection
    private List<String> postTechStack;

}