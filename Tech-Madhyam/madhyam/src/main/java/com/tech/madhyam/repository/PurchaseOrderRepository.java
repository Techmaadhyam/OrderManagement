package com.tech.madhyam.repository;

import com.tech.madhyam.controller.PurchaseOrderWrapper;
import com.tech.madhyam.controller.YearMonthObjectPOWrapper;
import com.tech.madhyam.entity.PurchaseOrder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Query("FROM PurchaseOrder WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName")
	List<PurchaseOrder> getPurchaseOrderByUser(@Param("userId") long userId, @Param("companyName") String companyName);    

    @Query("FROM PurchaseOrder WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName) AND date(deliveryDate)=curdate()")
	List<PurchaseOrder> getAlPurchaseOrderBasedOnDeliveryDate(@Param("userId") long userId, 
                                    @Param("companyName") String companyName);     

    @Query("select count(*) FROM PurchaseOrder WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)" 
        + " AND status = :status")
    Integer getPurchaseOrderBasedOnStatus(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("status") String status); 
                                    
    @Query("select Count(id),status FROM PurchaseOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year" 
    +" GROUP BY status")
    List<Object> groupByBasedOnStatus(@Param("userId") long userId, 
                                      @Param("companyName") String companyName,
                                      @Param("monthname") String monthname,
                                      @Param("year") Integer year);
                                      
    @Query("FROM PurchaseOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year"
    +" AND tempUser.id = :customerid")
    List<Object> getPOBasedOnCustomer(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("monthname") String monthname,
                                    @Param("year") Integer year,
                                    @Param("customerid") long customerid); 

    @Query("SELECT new com.tech.madhyam.controller.YearMonthObjectPOWrapper(po , MONTHNAME(lastModifiedDate))"
    +" FROM PurchaseOrder AS po"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND YEAR(lastModifiedDate) = :year")
    List<YearMonthObjectPOWrapper> getPurchaseOrderAccountingForMonthYear(@Param("userId") long userId, 
                                                    @Param("companyName") String companyName,
                                                    @Param("year") Integer year);  
                                                    
    @Query("select new com.tech.madhyam.controller.PurchaseOrderWrapper(MONTHNAME(lastModifiedDate), SUM(totalAmount)) FROM PurchaseOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND YEAR(lastModifiedDate) = :year"
    + " GROUP BY MONTH(lastModifiedDate)")
    List<PurchaseOrderWrapper> getPurchaseOrderTotalAmountByMonthYear(@Param("userId") long userId, 
                                                    @Param("companyName") String companyName,
                                                    @Param("year") Integer year);                                                     
}
