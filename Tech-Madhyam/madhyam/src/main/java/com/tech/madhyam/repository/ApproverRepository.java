package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Approvers;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApproverRepository extends JpaRepository<Approvers, Long> {

    @Query("FROM Approvers WHERE salesOrder.id = :soId")
	List<Approvers> getApproversBySOId(@Param("soId") long soId);

    @Query("FROM Approvers WHERE purchaseOrder.id = :poId")
	List<Approvers> getApproversByPOId(@Param("poId") long poId);  
    
    @Query("FROM Approvers WHERE quotation.id = :quotationId")
	List<Approvers> getApproversByQuotationId(@Param("quotationId") long quotationId);  
    
    @Query("FROM Approvers WHERE approver.id = :approverId")
	List<Approvers> getApproversByApproverId(@Param("approverId") long approverId);     
}
