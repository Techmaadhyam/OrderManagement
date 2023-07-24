package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Warehouse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    @Query("FROM Warehouse WHERE createdBy = :userId  or createdByUser.companyName = :companyName")
	List<Warehouse> getWareHousesByUserId(@Param("userId") long userId, @Param("companyName") String companyName);


    @Query("select count(*) FROM Warehouse WHERE createdBy = :userId  or createdByUser.companyName = :companyName")
	Integer getWarehouseCount(@Param("userId") long userId, @Param("companyName") String companyName);    
}
