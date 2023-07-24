package com.tech.madhyam.controller;

import com.tech.madhyam.entity.PurchaseOrder;

public class YearMonthObjectPOWrapper {
    
    public PurchaseOrder purchaseOrder;
    public String monthname;

    public YearMonthObjectPOWrapper(PurchaseOrder purchaseOrder, String monthname){
        this.purchaseOrder = purchaseOrder;
        this.monthname = monthname;
    }

}