import React from "react";
import { Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { LogoContext } from "src/utils/logoContext";
import axios from "axios";
import { apiUrl } from "src/config";
import useAuthStore from "src/store/store";


const Logo = () => {


  const email = sessionStorage.getItem("mail");
  const password = sessionStorage.getItem("password");
  const { setLogo } = useContext(LogoContext);
  const [login, setLogin] = useState([]);
  const [breakpoint, setBreakpoint] = useState(0);

  useEffect(() => {
    console.log("useEffect is running");
    axios
      .get(apiUrl + `getAppUser/${email}/${password}`)
      .then((response) => {

        setLogo({
          file: response.data[0].company.logo,
          fileType: response.data[0].company.logotype,
          company: response.data[0].company.name,
          gstn: response.data[0].gstnumber,
          firstName: response.data[0].profile.name,
          lastName: response.data[0].profile.name,
          userName: response.data[0].username,
          mobile: response.data[0].zipcode,
          pincode: response.data[0].zipcode,
          type: response.data[0].category,
          address: response.data[0].address,
          city: response.data[0].city,
          state: response.data[0].state,
          country: response.data[0].country,
        });
        setLogin(response.data[0]);
        useAuthStore.setState({ user: response.data[0] });
        // console.log("response", response.data[0]);
      })
      .catch((error) => {
        console.error("company logo is not uploaded");
      });
  }, [setLogo]);


  if (login
    && login.company
    && login.profile
    && login.company.id
    && login.profile.id
    && breakpoint === 0
  ) {

    axios
      .get(apiUrl + `getSchemaTabs/${login.company.id}/${login.profile.id}`)
      .then((response) => {
        useAuthStore.setState({ tabs: response.data });
        setBreakpoint(1);
        console.log("its last")
      })
      .catch((error) => {
        console.error("tabs is not working");
      });
  }

}


export default Logo;
