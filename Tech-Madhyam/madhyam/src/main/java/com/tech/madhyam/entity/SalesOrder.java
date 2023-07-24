package com.tech.madhyam.entity;

import java.util.Date;

import javax.persistence.*;
import lombok.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="sales_order")
public class SalesOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    private long quotid;
    @ManyToOne
    public User companyuser;
    @ManyToOne
    public NonUser tempUser;
    private String contactPerson;
    private String contactPhone;  
    private double paidamount;  
    private double totalcost;
    private double totalcgst;
    private double totalsgst;      
    private double totaligst;
    public String status;
    private String paymentMode;
    private String modeofdelivery;
    private Date deliveryDate;
    private String type;
    private String deliveryAddress;
    private String city;
    private String state;
    private String country;
    private String pinCode;
    private double totalAmount;
    private String comments;
    private String termsAndCondition;    
    private long createdBy;
    private Date createdDate;
    private Date lastModifiedDate;
    @ManyToOne
    public
    User lastModifiedByUser;  
    @ManyToOne
    public
    User createdByUser;
}
