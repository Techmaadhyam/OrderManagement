package com.tech.madhyam.repository;

import com.tech.madhyam.entity.PurchaseOrderDetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderDetailsRepository extends JpaRepository<PurchaseOrderDetails, Long> {

    @Query("FROM PurchaseOrderDetails WHERE purchaseOrderId.id = :purchaseOrderId")
	List<PurchaseOrderDetails> getPurchaseOrderDetails(@Param("purchaseOrderId") long purchaseOrderId);       

}
