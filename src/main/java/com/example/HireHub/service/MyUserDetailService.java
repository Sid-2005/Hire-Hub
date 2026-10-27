package com.example.HireHub.service;

import com.example.HireHub.model.MyUser;
import com.example.HireHub.model.MyUsersDetail;
import com.example.HireHub.repo.MyUserRepo;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private MyUserRepo repo;

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) {

        MyUser user = repo.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Username not found: " + username
                        )
                );

        return new MyUsersDetail(user);
    }
}
