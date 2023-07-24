package com.tech.madhyam.repository;

import com.tech.madhyam.entity.Inventory;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("FROM Inventory WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName")
	List<Inventory> getInventoryByUserId(@Param("userId") long userId, @Param("companyName") String companyName);   

    
    @Query("FROM Inventory WHERE product.id IN :productIds")
	List<Inventory> getInventoryByProductId(@Param("productIds") Set<Long> productIds);

    @Query("FROM Inventory WHERE warehouse.id = :warehouseId")
	List<Inventory> getInventoryByWareHouseId(@Param("warehouseId") long warehouseId);     

    @Query("select count(*) FROM Inventory WHERE createdBy = :userId  or createdByUser.companyName = :companyName")
	Integer getInventoryCount(@Param("userId") long userId, @Param("companyName") String companyName);   
    
    @Query("select SUM(price) FROM Inventory"
          +" WHERE createdByUser.id = :userId  or createdByUser.companyName = :companyName"
          +" GROUP BY createdByUser.id")
	Double getTotalCost(@Param("userId") long userId, @Param("companyName") String companyName);
    
   
}