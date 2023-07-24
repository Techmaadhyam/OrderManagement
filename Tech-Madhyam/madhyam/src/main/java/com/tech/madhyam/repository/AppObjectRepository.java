package com.tech.madhyam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.madhyam.entity.AppObject;

public interface AppObjectRepository extends JpaRepository<AppObject, Long>{
    
}
