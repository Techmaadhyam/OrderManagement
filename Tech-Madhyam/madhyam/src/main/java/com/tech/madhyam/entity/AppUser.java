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
@Table(name="AppUser")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    @ManyToOne
    public Company company;
    @ManyToOne
    public Profile profile;
    public String email;
    public String username;
    public String password;
    public boolean isactive;
    public String address;
    public String country;
    public String state;
    public String city;
    public String zipcode;
    public String gstnumber;
    public String pandcard;
    public String category;
    public Date createddate;
    public Date lastmodifieddate;
}