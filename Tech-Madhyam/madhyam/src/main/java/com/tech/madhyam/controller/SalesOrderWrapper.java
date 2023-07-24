package com.tech.madhyam.controller;

public class SalesOrderWrapper {
    public double totalamount;
    public double paidamount;
    public String monthName;

    public SalesOrderWrapper(String monthName, double totalamount, double paidamount){
        this.monthName = monthName;
        this.totalamount =totalamount;
        this.paidamount = paidamount;
    }
   
}
