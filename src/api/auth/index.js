import { useState } from "react";
import { JWT_EXPIRES_IN, JWT_SECRET, sign } from "src/utils/jwt";
import axios from "axios";
import { apiUrl } from "src/config";
import useAuthStore from "src/store/store";



let users = {};



const signIn = async (request) => {
  const { email, password } = request;
  try {

    // const response = await axios.get(apiUrl + `getUserByUsername/${email}`);
    const response = await axios.get(apiUrl + `getAppUser/${email}/${password}`);
    users = response.data[0];
    // console.log("response", response.data[0].password);

    if (
      response &&
      response.data &&
      // response.data.loggedIUser.length > 0 &&
      password === response.data[0].password
    ) {
      window.sessionStorage.setItem("user", response.data[0].id);
      window.sessionStorage.setItem(
        "mail",
        response.data[0].username
      );
      window.sessionStorage.setItem(
        "password",
        response.data[0].password
      );
      localStorage.setItem("user", response.data[0].id);
    }
    const tabs = await axios.get(apiUrl + `getSchemaTabs/${response.data[0].company.id}/${response.data[0].profile.id}`);

    console.log(response.data[0]);
  } catch (error) {
    console.error("[Auth Api]: ", error);
  }

  return new Promise((resolve, reject) => {
    try {
      if (users.password !== password) {
        reject(new Error("Please check your email and password"));
      }

      const accessToken = sign({ userId: users.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      resolve({ accessToken });
    } catch (err) {
      console.error("[Auth Api]: ", err);
      reject(
        new Error(
          "Please register your account. If already registered then contact us at contactus@techmaadhyam.com for activation"
        )
      );
    }
  });
};

const me = (request) => {
  return new Promise((resolve, reject) => {
    try {
      if (!users) {
        reject(new Error("Invalid authorization token"));
        return;
      }

      resolve({
        id: users.id,
        avatar: "/assets/avatars/avatar-anika-visser.png",
        email: users.emailId,
        name: users.name,
        plan: users.id,
      });
    } catch (err) {
      console.error("[Auth Api]: ", err);
      reject(new Error("Internal server error"));
    }
  });
};

export const authApi = {
  signIn,
  me,
};


