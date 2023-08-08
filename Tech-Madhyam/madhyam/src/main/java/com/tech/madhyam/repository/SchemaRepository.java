package com.tech.madhyam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tech.madhyam.controller.SchemaFieldWrapper;
import com.tech.madhyam.controller.SchemaTabWrapper;
import com.tech.madhyam.entity.Schema;

public interface SchemaRepository extends JpaRepository<Schema, Long>{
    
    @Query("select new com.tech.madhyam.controller.SchemaTabWrapper(appobject.id, appobject.tablelabel, appobject.logo) FROM Schema"
    +" WHERE company.id = :companyid AND profile.id = :profileid AND isvisible = true"
    + " GROUP BY appobject.id")
    List<SchemaTabWrapper> getSchemaTabs(@Param("companyid") long companyid, 
                                @Param("profileid") long profileid);
                                
    @Query("select new com.tech.madhyam.controller.SchemaFieldWrapper(id, objectfield.fieldname, objectfield.fieldlabel , objectfield.fieldtype, objectfield.dropdownlovs," 
    +" isrequired, isvisible, placeholder, description) FROM Schema"
    +" WHERE company.id = :companyid AND profile.id = :profileid AND appobject.id = :tabid")
    List<SchemaFieldWrapper> getSchemaObjFields(@Param("companyid") long companyid, 
                                                 @Param("profileid") long profileid,
                                                 @Param("tabid") long tabid);                  

}