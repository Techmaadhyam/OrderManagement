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
@Table(name="SchemaRecordFieldValue")
public class SchemaRecordFieldValue {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    @ManyToOne
    private SchemaRecord schemarecord;
    @Column(columnDefinition = "JSON")
    private String allfieldvalue;
    @ManyToOne
    public AppUser createdby;
    @ManyToOne
    public AppUser lastmodifiedby;
    public Date createddate;
    public Date lastmodifieddate;  
}
