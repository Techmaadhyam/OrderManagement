package com.tech.madhyam.entity;

import java.sql.Date;

import javax.persistence.*;
import lombok.*;


@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private long purchaseOrderId;
    @ManyToOne
    public Warehouse warehouse;
    public int quantity;
    private String weight;
    private String size;
    private String hsncode;
    private double price;
    private double actualamount;
    private double sgst;
    private double cgst;
    private double igst;
    private String description;
    private long createdBy;
    private Date createdDate;
    private Date lastModifiedDate;
    @ManyToOne
    public
    User lastModifiedByUser;      
    @ManyToOne
    public
    Rack rack;    
    @ManyToOne
    public
    Category category;    
    @ManyToOne
    public
    User createdByUser;
    @ManyToOne
    public
    Product product;    
}