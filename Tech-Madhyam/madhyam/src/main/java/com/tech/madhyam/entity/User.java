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
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String companyName;
    private String gstNumber;
    private String userName;
    private String pandcard;
    private String password;
    private String firstName;
    private String lastName;
    private String emailId;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String type;
    private Date createdDate;
    private Date updatedDate;
    private boolean isactive;
    private boolean issuperuser;
}
