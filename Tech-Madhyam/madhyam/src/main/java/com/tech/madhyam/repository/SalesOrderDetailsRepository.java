package com.tech.madhyam.repository;

import com.tech.madhyam.entity.SalesOrderDetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesOrderDetailsRepository extends JpaRepository<SalesOrderDetails, Long> {

    @Query("FROM SalesOrderDetails WHERE salesOrderId.id = :salesOrderId")
	List<SalesOrderDetails> getAllSalesOrderDetails(@Param("salesOrderId") long salesOrderId);  

}
