package com.tech.madhyam.controller;

public class SchemaFieldWrapper {
    public String fieldname;
    public String fieldlabel;
    public String fieldtype;
    public String dropdownlovs;
    public String tabid;
    public boolean isrequired;
    public boolean isvisible;
    public String placeholder;
    public String description;
    public long id;

    public SchemaFieldWrapper(long id,
                             String fieldname, String fieldlabel, 
                             String fieldtype, String dropdownlovs,
                             boolean isrequired, boolean isvisible,
                             String placeholder, String description){
        this.id = id;
        this.fieldname = fieldname;
        this.fieldlabel = fieldlabel;
        this.fieldtype = fieldtype;
        this.dropdownlovs = dropdownlovs;
        this.isrequired =isrequired;
        this.isvisible = isvisible;
        this.placeholder = placeholder;
        this.description = description;
    }   
}