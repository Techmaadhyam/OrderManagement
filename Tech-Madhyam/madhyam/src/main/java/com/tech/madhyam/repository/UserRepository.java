package com.tech.madhyam.repository;

import com.tech.madhyam.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("FROM User WHERE userName = :username and isactive = true")
	List<User> getUserByUserName(@Param("username") String username);

    @Query("FROM User WHERE type = :type and id !=:userId")
	List<User> findByType(@Param("type") String type, @Param("userId") long userId);    

    @Query("FROM User")
	List<User> getAllUsers();      

    @Query("FROM User WHERE issuperuser = false")
	List<User> getAllUsersByCustomer();   
    
    @Query("FROM User WHERE issuperuser = true")
	List<User> getAllSuperUser();
}
