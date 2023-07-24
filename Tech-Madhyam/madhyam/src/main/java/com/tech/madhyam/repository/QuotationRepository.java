package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Quotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    @Query("FROM Quotation WHERE createdBy = :userId  or createdByUser.companyName = :companyName")
	List<Quotation> getAllQuotationsByUserId(@Param("userId") long userId, @Param("companyName") String companyName);       

    @Query("select count(*) FROM Quotation WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)" 
           + " AND status = :status")
    Integer getQuotationBasedOnStatus(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("status") String status);

    @Query("select Count(id),status FROM Quotation"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year" 
    +" GROUP BY status")
    List<Object> groupByBasedOnStatus(@Param("userId") long userId, 
                                      @Param("companyName") String companyName,
                                      @Param("monthname") String monthname,
                                      @Param("year") Integer year);

    @Query("FROM Quotation"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year"
    +" AND tempUser.id = :customerid")
    List<Object> getQuotationBasedOnCustomer(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("monthname") String monthname,
                                    @Param("year") Integer year,
                                    @Param("customerid") long customerid); 
}