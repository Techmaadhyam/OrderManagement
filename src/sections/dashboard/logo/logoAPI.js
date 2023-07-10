import React from "react";
import { Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { LogoContext } from "src/utils/logoContext";
import axios from "axios";
import { apiUrl } from "src/config";

const Logo = () => {


  const mail = sessionStorage.getItem("mail");
  const { setLogo } = useContext(LogoContext);

    useEffect(() => {
        console.log("useEffect is running");
        axios
            .get(apiUrl + `getUserByUsername/${mail}`)
            .then((response) => {

                setLogo({
                  file: response.data.documents[0].fileData,
                  fileType: response.data.documents[0].fileType,
                  company: response.data.loggedIUser[0].companyName,
                  gstn: response.data.loggedIUser[0].gstNumber,
                  firstName: response.data.loggedIUser[0].firstName,
                  lastName: response.data.loggedIUser[0].lastName,
                  userName: response.data.loggedIUser[0].userName,
                });
            })
            .catch((error) => {
                console.error("company logo is not uploaded");
            });
    }, [setLogo]);

  
  
};

export default Logo;
