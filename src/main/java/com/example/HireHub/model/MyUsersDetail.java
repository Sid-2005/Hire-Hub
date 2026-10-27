package com.example.HireHub.model;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;


public class MyUsersDetail implements UserDetails {

    private MyUser user;

    public MyUsersDetail(MyUser users) {
        this.user = users;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.getRole();
        if (role == null || role.isBlank()) {
            role = "USER";
        }
        String roleWithPrefix = role.startsWith("ROLE_") ? role.toUpperCase() : "ROLE_" + role.toUpperCase();
        return Collections.singleton(new SimpleGrantedAuthority(roleWithPrefix));
    }

    @Override
    public @Nullable String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
