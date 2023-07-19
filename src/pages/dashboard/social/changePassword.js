import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
  Stack,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
  SvgIcon,
  Typography,
  Link,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { primaryColor } from "src/primaryColor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { apiUrl } from "src/config";
import { useLocation } from "react-router-dom";

const Page = () => {
  const location = useLocation();
  const state = location.state;

  //form state handling
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);

  //updating form state
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "password":
        setPassword(value);
        break;
      case "confirmpassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const notify = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleToHome = async (event) => {
    event.preventDefault();

    if (password === confirmPassword) {
      if (password) {
        try {
          const response = await fetch(apiUrl + "addUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: state?.id,
              password: password,
              companyName: state?.companyName,
              userName: state?.emailId,
              firstName: state?.firstName,
              lastName: state?.lastName,
              emailId: state?.emailId,
              mobile: state?.mobile,
              address: state?.address,
              city: state?.city,
              state: state?.state,
              country: state?.country,
              type: state?.type,
              isactive: state?.isactive,
              issuperuser: state?.issuperuser,
              gstNumber: state?.gstNumber,
              pandcard: state?.pandcard,
              createdDate: state?.createdDate,
              pincode: state?.pincode,
              updatedDate: new Date(),
            }),
          });

          if (response.ok) {
            // Redirect to home page upon successful submission

            response.json().then((data) => {
              console.log(data);
              notify(
                "success",
                "You have successfully changed Password. Please log out and login again."
              );
              //localStorage.setItem('notification', true);
              //window.location.href = paths.index;
            });
          } else {
            notify("error", "Failed to submit. Please try again later.");
          }
        } catch (error) {
          notify(
            "error",
            "An error occurred while submitting. Please try again later."
          );
        }
      } else {
        notify("error", "Please input all fields before submitting.");
      }
    } else {
      notify("error", "Your password does not match, please re-verify.");
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.social.profile}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="none"
              >
                <SvgIcon
                  sx={{
                    mr: 1,
                    width: 38,
                    height: 38,
                    transition: "color 0.5s",
                    "&:hover": { color: `${primaryColor}` },
                  }}
                >
                  <ArrowCircleLeftOutlinedIcon />
                </SvgIcon>
                <Typography variant="subtitle2">
                  Back To{" "}
                  <span style={{ color: `${primaryColor}`, fontWeight: 600 }}>
                    Profile
                  </span>
                </Typography>
              </Link>
            </div>
            <Box sx={{ mb: 1 }}>
              <Stack
                alignItems="center"
                component={RouterLink}
                direction="column"
                display="flex"
                spacing={1}
                sx={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <img
                    alt=""
                    src="/assets/icons/icon.png"
                    style={{ width: "auto", height: 40 }}
                  />
                </Box>

                <Box
                  sx={{
                    color: primaryColor,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "0.3px",
                    lineHeight: 1,
                    "& span": {
                      color: "primary.main",
                    },
                  }}
                >
                  TechMaadhyam
                </Box>
              </Stack>
            </Box>

            <div style={{ minWidth: "100%", marginBottom: "1rem" }}>
              <form>
                <Grid container justifyContent="center" alignItems="center">
                  <Card sx={{ width: 500, mt: 4 }}>
                    <CardHeader
                      titleTypographyProps={{ variant: "h5" }}
                      title="Update Your Password"
                      subheader="Need Assistance? Get in touch with us at ."
                    />
                    <CardHeader
                      titleTypographyProps={{ variant: "subtitle2" }}
                      title="Create a New Password"
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Grid container spacing={3}>
                        {/* <Grid
                     xs={12}
                     md={12}
                   >
                     <TextField
                           fullWidth
                           label="Enter OTP sent to your email"
                           name="otp"
                           type= 'number'
                  
                         >
                         </TextField>
                   </Grid> */}

                        <Grid xs={12} md={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmpassword"
                            type="password"
                            value={confirmPassword}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                      </Grid>

                      <Grid xs={12} md={6}></Grid>
                      {step > 1 && (
                        <Button
                          color="primary"
                          variant="contained"
                          align="right"
                          sx={{ mt: 2 }}
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                      )}
                    </CardContent>

                    <Box
                      sx={{ mt: 0, mr: 2, mb: 2 }}
                      display="flex"
                      justifyContent="flex-end"
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        align="right"
                        onClick={handleToHome}
                        type="submit"
                      >
                        Save
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </form>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",

          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flex: {
              xs: "1 1 auto",
              md: "0 0 auto",
            },
            flexDirection: "column",
            maxWidth: "100%",
            p: {
              xs: 4,
              md: 3,
            },
            width: {
              md: "100%",
            },
            overflowY: "hidden",
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {renderFormStep()}
        </Box>
      </Box>
    </>
  );
};

export default Page;
