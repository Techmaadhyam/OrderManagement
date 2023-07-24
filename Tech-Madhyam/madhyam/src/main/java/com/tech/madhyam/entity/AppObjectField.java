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
@Table(name="AppObjectField")
public class AppObjectField {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    public String fieldname;
    public String fieldlabel;
    public String fieldtype;
    public String dropdownlovs;
    public String tabid;
    public String description;
    public Date createddate;
    public Date lastmodifieddate;  
}
