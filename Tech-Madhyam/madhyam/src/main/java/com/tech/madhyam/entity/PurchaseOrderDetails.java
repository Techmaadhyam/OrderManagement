package com.tech.madhyam.entity;
import javax.persistence.*;
import lombok.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="purchase_order_details")
public class PurchaseOrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne
    public PurchaseOrder purchaseOrderId;
    @ManyToOne
    public Product product;
    private long quantity;
    private String size;
    private String weight;    
    private double price;
    private double sgst;
    private double cgst;
    private double igst;
    private String description;
    private String comments;    
    private long createdBy;
    private String createdDate;
    private String lastModifiedDate;
    @ManyToOne
    public
    Inventory inventory;    
}
