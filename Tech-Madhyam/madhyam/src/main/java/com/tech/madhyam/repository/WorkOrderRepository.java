package com.tech.madhyam.repository;

import com.tech.madhyam.controller.YearMonthObjectWOWrapper;
import com.tech.madhyam.entity.WorkOrder;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    
    @Query("FROM WorkOrder WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName")
	List<WorkOrder> getWorkOrders(@Param("userId") long userId, @Param("companyName") String companyName);   
    
    @Query("FROM WorkOrder WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
          +" AND DATEDIFF(enddate, :todayDate) <= 30"
          +" AND category = :category")
	List<WorkOrder> getAllExpriyWorkOrder(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("todayDate") Date todayDate,
                                    @Param("category") String category);    
                                
    @Query("FROM WorkOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year"
    +" AND noncompany.id = :customerid")
    List<Object> getWOBasedOnCustomer(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("monthname") String monthname,
                                    @Param("year") Integer year,
                                    @Param("customerid") long customerid); 

    @Query("SELECT new com.tech.madhyam.controller.YearMonthObjectWOWrapper(wo, MONTHNAME(lastModifiedDate))"
    + " FROM WorkOrder wo"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND YEAR(lastModifiedDate) = :year AND category =:category")
    List<YearMonthObjectWOWrapper> getWorkOrderAccountingForMonthYear(@Param("userId") long userId, 
                                                    @Param("companyName") String companyName,
                                                    @Param("year") Integer year,
                                                    @Param("category") String category);                                    
}
