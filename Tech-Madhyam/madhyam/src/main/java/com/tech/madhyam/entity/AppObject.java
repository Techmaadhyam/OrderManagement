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
@Table(name="AppObject")
public class AppObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;
    public String tablename;
    public String tablelabel;
    public String parenttabname;
    @ManyToOne
    public Document iconimage;
    public boolean isvisible;
    public String description;
    public Date createddate;
    public Date lastmodifieddate;    
}
