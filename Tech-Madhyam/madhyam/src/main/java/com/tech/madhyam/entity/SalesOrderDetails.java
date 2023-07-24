package com.tech.madhyam.entity;
import javax.persistence.*;
import lombok.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="sales_order_details")
public class SalesOrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne
    public SalesOrder salesOrderId;
    private long warehouseId;
    private String size;
    private String weight;
    public int quantity;
    private double price;
    private double sgst;
    private double cgst;
    private double igst;
    private double discountpercent;
    private String description;
    private String comments;    
    private long createdBy;
    private String createdDate;
    private String lastModifiedDate;    
    @ManyToOne
    public
    Inventory inventory;     
}
