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
@Table(name="Company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    public String name;
    @Lob
    private byte[] logo;
    private String logotype;
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
