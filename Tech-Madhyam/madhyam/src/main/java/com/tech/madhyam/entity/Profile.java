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
@Table(name="Profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;   
    public String name;
    public String description;
    public Date createddate;
    public Date lastmodifieddate;
}
