package com.tech.madhyam.repository;

import com.tech.madhyam.controller.SalesOrderWrapper;
import com.tech.madhyam.controller.YearMonthObjectSOWrapper;
import com.tech.madhyam.entity.SalesOrder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    @Query("FROM SalesOrder WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName")
	List<SalesOrder> getAllSalesOrderDetailByUser(@Param("userId") long userId, @Param("companyName") String companyName);
    
    @Query("FROM SalesOrder WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName) AND date(deliveryDate)=curdate()")
	List<SalesOrder> getAllSalesOrderBasedOnDeliveryDate(@Param("userId") long userId, 
                                    @Param("companyName") String companyName);
                                    
    @Query("select count(*) FROM SalesOrder WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)" 
           + " AND status = :status")
    Integer getSalesOrderBasedOnStatus(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("status") String status);

    @Query("select Count(id),status FROM SalesOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year"
    +" GROUP BY status")
    List<Object> groupByBasedOnStatus(@Param("userId") long userId, 
                                      @Param("companyName") String companyName,
                                      @Param("monthname") String monthname,
                                      @Param("year") Integer year);

    @Query("FROM SalesOrder"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND MONTHNAME(createdDate) = :monthname AND YEAR(createdDate) = :year"
    +" AND tempUser.id = :customerid")
    List<Object> getSOBasedOnCustomer(@Param("userId") long userId, 
                                    @Param("companyName") String companyName,
                                    @Param("monthname") String monthname,
                                    @Param("year") Integer year,
                                    @Param("customerid") long customerid);

    @Query("SELECT new com.tech.madhyam.controller.YearMonthObjectSOWrapper(so, MONTHNAME(lastModifiedDate))"
    +" FROM SalesOrder so"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND YEAR(lastModifiedDate) = :year")
    List<YearMonthObjectSOWrapper> getSalesOrderAccountingForMonthYear(@Param("userId") long userId, 
                                                    @Param("companyName") String companyName,
                                                    @Param("year") Integer year);

    @Query("select new com.tech.madhyam.controller.SalesOrderWrapper(MONTHNAME(lastModifiedDate), SUM(so.totalAmount), SUM(so.paidamount)) FROM SalesOrder AS so"
    +" WHERE (createdByUser.id = :userId  or createdByUser.companyName = :companyName)"
    + " AND YEAR(lastModifiedDate) = :year"
    + " GROUP BY MONTH(lastModifiedDate)")
    List<SalesOrderWrapper> getSalesOrderTotalAmountByMonthYear(@Param("userId") long userId, 
                                                    @Param("companyName") String companyName,
                                                    @Param("year") Integer year);                                                    

}
