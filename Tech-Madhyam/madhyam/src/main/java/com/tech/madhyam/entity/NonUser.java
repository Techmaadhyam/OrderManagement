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
@Table(name="non_user")
public class NonUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String companyName;
    private String gstNumber;
    private String pandcard;
    private String userName;
    private String contactpersonname;
    private String emailId;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String type;
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
