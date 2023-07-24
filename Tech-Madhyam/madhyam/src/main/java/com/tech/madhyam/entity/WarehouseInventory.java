package com.tech.madhyam.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="warehouse_inventory")
public class WarehouseInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private int warehouseId;
    private int inventoryId;
    private int quantity;
    private int purchaseOrderId;
    private String lastModifiedDate;
    private int createdBy;
    private String createdDate;    
}
