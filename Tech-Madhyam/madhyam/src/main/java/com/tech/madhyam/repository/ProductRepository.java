package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE createdBy = :userId or createdByUser.companyName = :companyName")
	List<Product> getProductByUserId(@Param("userId") long userId, @Param("companyName") String companyName);
    
}
