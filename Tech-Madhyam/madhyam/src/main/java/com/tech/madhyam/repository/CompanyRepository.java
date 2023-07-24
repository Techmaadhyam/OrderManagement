package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Company;


import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long>{
}