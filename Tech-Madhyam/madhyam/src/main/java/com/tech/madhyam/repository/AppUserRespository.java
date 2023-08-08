package com.tech.madhyam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tech.madhyam.entity.AppUser;

public interface AppUserRespository extends JpaRepository<AppUser, Long>{
    
    @Query("FROM AppUser WHERE username = :username and password = :password and isactive = true")
	List<AppUser> getAppUserByUserName(@Param("username") String username,
                                       @Param("password") String password);    

}