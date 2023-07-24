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
@Table(name="category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    public String name;
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
