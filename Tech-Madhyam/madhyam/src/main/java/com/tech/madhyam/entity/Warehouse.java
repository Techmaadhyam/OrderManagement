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
@Table(name="warehouse")
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private String contactName;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipcode;
    private String description;
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
