package com.tech.madhyam.entity;

import javax.persistence.*;
import lombok.*;
@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="quotation_details")
public class QuotationDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne
    public Product product;
    @ManyToOne
    public Quotation quotationId;
    private long quantity;
    private String size;
    private String workstationCount;
    private String weight;
    private double price;
    private double sGST;
    private double cGST;
    private double iGST;  
    private String description;
    private String comments;
    private long createdBy;
    private String createdDate;
    private String lastModifiedDate;
    @ManyToOne
    public
    Inventory inventory;    
}
