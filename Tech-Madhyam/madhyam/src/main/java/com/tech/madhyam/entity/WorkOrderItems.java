package com.tech.madhyam.entity;
import lombok.*;
import javax.persistence.*;
@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="workorderitems")
public class WorkOrderItems {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    @ManyToOne
    public
    Product product;
    public double unitPrice;
    private double discountpercent;
    public double cgst;
    public double sgst;        
    public double igst;
    public String workstationcount; 
    @ManyToOne 
    public WorkOrder workOrder;
    private String description;    
    private String comment;
}
