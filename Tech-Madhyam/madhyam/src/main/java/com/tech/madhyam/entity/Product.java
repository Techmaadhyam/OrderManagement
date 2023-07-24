package com.tech.madhyam.entity;

import lombok.*;

import java.util.Date;

import javax.persistence.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String productName;
    private String partnumber;
    private String type;
    private String description;
    private long createdBy;
    private double gstpercent; 
    private double sgst;
    private double cgst;
    private double igst;
    private Date createdDate;
    private Date lastModifiedDate;
    @ManyToOne
    public
    User lastModifiedByUser;      
    @ManyToOne
    public
    User createdByUser;  
    @ManyToOne  
    public
    Category category;    
}