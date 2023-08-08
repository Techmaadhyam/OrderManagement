package com.tech.madhyam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tech.madhyam.entity.SchemaRecord;

public interface SchemaRecordRepository extends JpaRepository<SchemaRecord, Long>{

    @Query("select recordid FROM SchemaRecord"
    +" WHERE company.id = :companyid AND profile.id = :profileid AND appobject.id = :tabid  ORDER BY recordid DESC")
    List<SchemaRecord> getSchemaRecordIdBasedonTabId(@Param("companyid") long companyid, 
                                                    @Param("profileid") long profileid,
                                                    @Param("tabid") long tabid);
    
}
