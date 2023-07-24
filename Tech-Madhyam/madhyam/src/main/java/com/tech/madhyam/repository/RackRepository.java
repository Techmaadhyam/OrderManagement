package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Rack;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface  RackRepository extends JpaRepository<Rack, Long>  {
    @Query("FROM Rack WHERE createdBy = :userId or createdByUser.companyName = :companyName")
	List<Rack> getRackByUserId(@Param("userId") long userId, @Param("companyName") String companyName);    
}
