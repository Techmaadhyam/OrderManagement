package com.tech.madhyam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tech.madhyam.entity.WorkOrderItems;

public interface WorkOrderItemsRepository extends JpaRepository<WorkOrderItems, Long>  {

    @Query("FROM WorkOrderItems WHERE workOrder.id = :workOrderId")
	List<WorkOrderItems> getWorkOrdersItems(@Param("workOrderId") long workOrderId); 
    
}
