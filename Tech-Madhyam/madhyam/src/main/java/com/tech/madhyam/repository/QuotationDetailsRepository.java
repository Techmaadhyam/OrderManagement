package com.tech.madhyam.repository;

import com.tech.madhyam.entity.QuotationDetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuotationDetailsRepository extends JpaRepository<QuotationDetails, Long> {

    @Query("FROM QuotationDetails WHERE quotationId.id = :quotationId")
	List<QuotationDetails> getAllQuotationDetails(@Param("quotationId") long quotationId);     

}
