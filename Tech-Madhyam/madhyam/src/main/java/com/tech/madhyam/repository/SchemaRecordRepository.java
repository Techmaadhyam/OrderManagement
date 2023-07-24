package com.tech.madhyam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tech.madhyam.entity.SchemaRecord;

public interface SchemaRecordRepository extends JpaRepository<SchemaRecord, Long>{

    @Query("FROM SchemaRecord"
    +" WHERE schema.company.id = :companyid AND schema.profile.id = :profileid AND schema.appobject.id = :tabid")
    List<SchemaRecord> getSchemaObjFieldValue(@Param("companyid") long companyid, 
                                                    @Param("profileid") long profileid,
                                                    @Param("tabid") long tabid);    
    
}
