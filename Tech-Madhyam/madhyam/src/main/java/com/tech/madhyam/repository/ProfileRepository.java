package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Profile;


import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long>{
    
}
