package com.tech.madhyam.repository;

import com.tech.madhyam.entity.NonUser;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NonUserRepository extends JpaRepository<NonUser, Long> {

    @Query("FROM NonUser WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName")
	List<NonUser> getNonTempByUserId(@Param("userId") long userId, @Param("companyName") String companyName);

}
