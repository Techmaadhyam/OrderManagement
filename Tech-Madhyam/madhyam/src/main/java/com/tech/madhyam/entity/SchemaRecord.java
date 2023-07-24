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
@Table(name="SchemaRecord")
public class SchemaRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    @ManyToOne
    public Schema schema;
    @ManyToOne
    public SchemaRecord schemarecord;    
    public String fieldvalue;
    @ManyToOne
    public AppUser createdby;
    @ManyToOne
    public AppUser lastmodifiedby;
    public Date createddate;
    public Date lastmodifieddate;
}