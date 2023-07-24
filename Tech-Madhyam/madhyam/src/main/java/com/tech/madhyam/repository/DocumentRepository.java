package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Document;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("FROM Document WHERE salesOrderId = :salesOrderId")
	List<Document> getDocumentBySOId(@Param("salesOrderId") long salesOrderId); 

    @Query("FROM Document WHERE purchaseOrderId = :purchaseOrderId")
	List<Document> getDocumentByPOId(@Param("purchaseOrderId") long purchaseOrderId); 
    
    @Query("FROM Document WHERE quotationId = :quotationId")
	List<Document> getDocumentByQuotationId(@Param("quotationId") long quotationId);   
    
    @Query("FROM Document WHERE createdByUser.id = :loginUserId and fileName = :companylogo")
	List<Document> getLogoByLoginUser(@Param("loginUserId") long loginUserId,
                                      @Param("companylogo") String companylogo);     

}
