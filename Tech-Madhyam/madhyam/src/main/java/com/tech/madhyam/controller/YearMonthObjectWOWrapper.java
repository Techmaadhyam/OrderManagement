package com.tech.madhyam.controller;

import com.tech.madhyam.entity.WorkOrder;

public class YearMonthObjectWOWrapper {
    public WorkOrder workOrder;
    public String monthname;

    public YearMonthObjectWOWrapper(WorkOrder workOrder, String monthname){
        this.workOrder = workOrder;
        this.monthname = monthname;
    }     
}
