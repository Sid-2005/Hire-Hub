package com.example.HireHub.service;


import com.example.HireHub.model.MyUser;
import com.example.HireHub.repo.MyUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MyUsersService {

    @Autowired
    private MyUserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public MyUser register(MyUser users) {
        if (users.getRole() == null || users.getRole().trim().isEmpty()) {
            users.setRole("USER");
        } else {
            users.setRole(users.getRole().trim().toUpperCase());
        }
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        return repo.save(users);
    }
}
