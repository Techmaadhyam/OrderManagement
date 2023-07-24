package com.tech.madhyam.controller;

public class PurchaseOrderWrapper {
    public double totalamount;
    public String monthName;

    public PurchaseOrderWrapper(String monthName, double totalamount){
        this.monthName = monthName;
        this.totalamount =totalamount;
    }
}
