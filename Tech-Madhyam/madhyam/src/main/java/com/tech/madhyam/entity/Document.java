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
@Table(name="document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private long salesOrderId;
    private long purchaseOrderId;
    private long quotationId;
    private String fileName;
    private String fileType;
    @Lob
    private byte[] fileData;
    @ManyToOne
    public
    User createdByUser;  
    @ManyToOne
    public
    SchemaRecord schemarecord;    
    @ManyToOne
    public
    User lastModifiedByUser;  
    private Date createdDate;
    private Date lastModifiedDate;              
}
