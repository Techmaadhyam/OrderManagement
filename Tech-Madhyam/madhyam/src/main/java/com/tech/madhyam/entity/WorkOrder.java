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
@Table(name="workorder")
public class WorkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    private Date startdate;
    private Date enddate;
    private String status;
    private String contactPersonName;
    private String contactPhoneNumber;
    private String contactEmail;
    private String adminPersonName;
    private String adminPhoneNumber;
    private String adminEmail;
    private String type;
    private double paidamount;
    private double totalamount;
    private double totalcost;
    private double totalcgst;
    private double totalsgst;      
    private double totaligst;    
    private String category;  
    @ManyToOne
    public
    User company;   
    @ManyToOne
    public
    NonUser noncompany;       
    @ManyToOne
    public NonUser technicianInfo; 
    private Date createdDate;
    private Date lastModifiedDate;
    @ManyToOne
    public
    User lastModifiedByUser;     
    @ManyToOne
    public
    User createdByUser; 
    private String comments;
    private String termsAndCondition;
    private long quotid;

}