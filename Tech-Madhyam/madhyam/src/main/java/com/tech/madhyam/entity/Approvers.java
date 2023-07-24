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
@Table(name="Approver")
public class Approvers {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    @ManyToOne
    public
    User approver;
    private String status;
    @ManyToOne
    public
    SalesOrder salesOrder;
    @ManyToOne
    public
    PurchaseOrder purchaseOrder;
    @ManyToOne
    public
    Quotation quotation;
    private Date createdDate;
    private Date lastModifiedDate; 
    @ManyToOne
    public
    User lastModifiedByUser;         
    @ManyToOne
    public
    User createdByUser;   
}
