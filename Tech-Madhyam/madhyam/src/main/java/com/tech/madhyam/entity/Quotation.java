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
@Table(name="quotation")
public class Quotation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    private Date deliveryDate;
    private Date startdate;
    private Date enddate;
    private String status;
    private String type;
    private String category;
    private String contactPersonName;
    private String modeofdelivery;
    private String contactPhoneNumber;
    private String contactEmail;
    private String adminPersonName;
    private String adminPhoneNumber;
    private String adminEmail;    
    private long salesOrderId;
    private long purchaseOrderId;
    @ManyToOne
    public User companyuser;
    @ManyToOne
    public NonUser tempUser;
    private double totalAmount;
    private String comments;
    private String termsAndCondition;
    private long createdBy;
    private Date createdDate;
    private Date lastModifiedDate;  
    private String deliveryAddress;
    private String city;
    private String state;
    private String country;
    private String pinCode;     
    @ManyToOne
    public
    User lastModifiedByUser;     
    @ManyToOne
    public
    User createdByUser; 
       
}
