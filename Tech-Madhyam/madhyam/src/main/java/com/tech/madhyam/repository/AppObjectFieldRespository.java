package com.tech.madhyam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.madhyam.entity.AppObjectField;

public interface AppObjectFieldRespository extends JpaRepository<AppObjectField, Long>{
    
}