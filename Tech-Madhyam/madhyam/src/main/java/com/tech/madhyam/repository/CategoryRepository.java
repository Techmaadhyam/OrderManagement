package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("FROM Category WHERE createdByUser.id = :userId or createdByUser.companyName = :companyName")
	List<Category> getCategoryByUserId(@Param("userId") long userId, @Param("companyName") String companyName);

}
