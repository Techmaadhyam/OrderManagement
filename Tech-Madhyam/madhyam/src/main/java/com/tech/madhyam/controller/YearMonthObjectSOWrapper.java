package com.tech.madhyam.controller;

import com.tech.madhyam.entity.SalesOrder;

public class YearMonthObjectSOWrapper {
    
    public SalesOrder salesOrder;
    public String monthname;

    public YearMonthObjectSOWrapper(SalesOrder salesOrder, String monthname){
        this.salesOrder = salesOrder;
        this.monthname = monthname;
    }  
}
