package com.tech.madhyam.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.madhyam.entity.SchemaRecordFieldValue;

public interface SchemaRecordFieldValueRepository extends JpaRepository<SchemaRecordFieldValue, Long>{
    
}