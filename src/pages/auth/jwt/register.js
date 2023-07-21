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
import { Delete } from "@mui/icons-material";
import {
  fetchAccessToken,
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchIndianStates,
} from "src/utils/api-service";

const customerType = [
  {
    label: "Distributor",
    value: "Distributor",
  },
  {
    label: "Retailer",
    value: "Retailer",
  },
  {
    label: "Manufacturer",
    value: "Manufacturer",
  },
  {
    label: "Customer",
    value: "Customer",
  },
];

const Register = () => {
  //image carousel state handeling
  const [currentImage, setCurrentImage] = useState(0);
  // country, state, city API access token
  const [accessToken, setAccessToken] = useState(null);

  //state management for countries,states and cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("India");
  const [currentState, setCurrentState] = useState([]);
  const [currentCity, setCurrentCity] = useState([]);

  //form state handling
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [gstn, setGstn] = useState("");
  const [pan, setPan] = useState("");

  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState(false);

  //handle file uploads
  const [uploadFile, setUploadFile] = useState(null);

  //updating form state
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "firstname":
        setFirstName(value);
        break;
      case "lastname":
        setLastName(value);
        break;
      case "Email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "company":
        setCompany(value);
        break;
      case "gstn":
        setGstn(value);
        break;
      case "pan":
        setPan(value);
        break;
      case "type":
        setType(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "zipcode":
        setZipcode(value);
        break;
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

  //check if email field is open
  const handleBlur = () => {
    setTouched(true);
  };

  //add email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasError = touched && !emailRegex.test(email);

  //handle next and back button
  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  //getting current date
  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-ZA", options);
    setCurrentDate(formattedDate);
  }, []);

  //get access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await fetchAccessToken();
        setAccessToken(accessToken);
      } catch (error) {
        console.error(error);
        setTimeout(fetchData, 500);
      }
    };

    fetchData();
  }, []);

  //fetches country list for dropdown and pushesh it to state which is later mapped
  const fetchCountriesData = useCallback(async () => {
    try {
      if (accessToken) {
        const countries = await fetchCountries(accessToken);
        setCountries(countries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, [accessToken]);

  //fetches states list for dropdown and pushesh it to setStates which is later mapped
  const handleCountry = async (event) => {
    try {
      setCurrentCountry(event.target.value);
      if (accessToken) {
        const states = await fetchStates(accessToken, event.target.value);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  //fetches cities list for dropdown and pushesh it to setCities which is later mapped
  const handleState = async (event) => {
    try {
      setCurrentState(event.target.value);
      if (accessToken) {
        const cities = await fetchCities(accessToken, event.target.value);
        setCities(cities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  //sets default country to India and fetches state list for India and is pushed to setStates
  const handleDefaultState = useCallback(async () => {
    try {
      if (currentCountry === "India" && accessToken) {
        const states = await fetchIndianStates(accessToken);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching Indian states:", error);
    }
  }, [accessToken, currentCountry]);

  //useeffect fetch request being called on componet mount
  useEffect(() => {
    if (accessToken) {
      fetchCountriesData();
      handleDefaultState();
    }
  }, [accessToken, fetchCountriesData, handleDefaultState]);

  //sets current city value in MUI select field onchange event
  const handleCities = async (event) => {
    setCurrentCity(event.target.value);
  };

  //mapping countries to MUI select input field
  const userOptionsCountry = useMemo(() => {
    return countries?.map((country) => ({
      label: country.country_name,
      value: country.country_name,
    }));
  }, [countries]);

  //mapping states to MUI select input field
  const userOptionsState = useMemo(() => {
    return states?.map((state) => ({
      label: state.state_name,
      value: state.state_name,
    }));
  }, [states]);

  //mapping cities to MUI select input field
  const userOptionsCities = useMemo(() => {
    return cities?.map((city) => ({
      label: city.city_name,
      value: city.city_name,
    }));
  }, [cities]);

  //toast notification from toastify library
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

  const images = [
    "/assets/logos/logo.png",
    "/assets/logos/logo1.png",
    "/assets/logos/logo2.png",
    "/assets/logos/logo3.png",
    "/assets/logos/logo4.png",
    "/assets/logos/logo5.png",
    "/assets/logos/logo6.png",
    "/assets/logos/logo7.png",
    "/assets/logos/logo8.png",
    "/assets/logos/logo9.png",
    "/assets/logos/logo10.png",
  ];

  //handles image carousel
  const handleImageChange = useCallback(() => {
    setCurrentImage((currentImage) => (currentImage + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const intervalId = setInterval(handleImageChange, 3000);
    return () => clearInterval(intervalId);
  }, [handleImageChange]);
console.log(uploadFile)
  //calls toast notification on sucessful registration and redirects to login page, handles fetch POST request
  const handleToHome = async (event) => {
    event.preventDefault();

    if (password === confirmPassword) {
      if (
        firstName &&
        lastName &&
        email &&
        phone &&
        company &&
        type &&
        currentCountry &&
        currentState &&
        currentCity &&
        zipcode &&
        password &&
        address &&
        gstn && 
        pan
      
      ) {
        try {
          const response = await fetch(apiUrl + "addUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: company,
              userName: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
              emailId: email,
              mobile: `+91 ${phone}`,
              address: address,
              city: currentCity,
              state: currentState,
              country: currentCountry,
              type: type,
              gstNumber: gstn,
              pandcard: pan,
              pincode: zipcode,
              createdDate: new Date(),
              updatedDate: new Date(),
            }),
          });

          if (response.ok) {
            // Redirect to home page upon successful submission

            response.json().then(async (data) => {
              if (uploadFile) {
                const formData = new FormData();

                let jsonBodyData = {};

                let file = uploadFile;
    
                jsonBodyData.fileName = "companylogo";
                jsonBodyData.fileType = uploadFile?.type;
                jsonBodyData.createdbyid = data.id;
                jsonBodyData.lastmodifybyid = null;
                jsonBodyData.createdDate = new Date();
                jsonBodyData.lastModifiedDate = new Date();

                formData.append("file", file);
                formData.append("fileWrapper", JSON.stringify(jsonBodyData));

                try {
                  const uploadResponse = await fetch(apiUrl + "upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (uploadResponse.ok) {
                    notify(
                      "success",
                      "You have successfully registered your account. Please Log In."
                    );
                    localStorage.setItem("notification", true);
                    window.location.href = paths.index;
                  } else {
                    console.error("Logo upload failed");
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            });
          } else {
            notify(
              "error",
              "Failed to submit the form. Please try again later."
            );
          }
        } catch (error) {
          notify(
            "error",
            "An error occurred while submitting the form. Please try again later."
          );
        }
      } else {
        notify("error", "Please input all fields before submitting.");
      }
    } else {
      notify("error", "Your password does not match, please re-verify.");
    }
  };

  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    setUploadFile(file);

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      // Perform necessary operations with the file, such as saving or previewing

    } else {
      // Display an error message or perform any other error handling
      alert("Invalid file format. Please select a PNG or JPEG file.");
    }
  };

  //delete uploaded files from state
  const handleDeleteFile = (fileType) => {
    switch (fileType) {
      case "upload":
        setUploadFile(null);
        document.getElementById("upload").value = "";
        break;
      default:
        break;
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
                href={paths.index}
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
                    Log In
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
              <h2>New User Registration</h2>
              <form>
                <Card>
                  <CardHeader title="Create new account" />
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={3}>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstname"
                          value={firstName}
                          onChange={handleInputChange}
                        ></TextField>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastname"
                          value={lastName}
                          onChange={handleInputChange}
                        ></TextField>
                      </Grid>
                      <Grid xs={12} md={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="Email"
                          value={email}
                          onChange={handleInputChange}
                          helperText={hasError && "Please enter a valid email."}
                          onBlur={handleBlur}
                          error={hasError}
                        ></TextField>
                      </Grid>
                      <Grid xs={12} md={12}>
                        <div style={{ display: "flex" }}>
                          <TextField
                            style={{ width: 100, marginRight: 10 }}
                            label="Code"
                            name="countryCode"
                            type="text"
                            value={"+91"}
                          />
                          <TextField
                            style={{ flexGrow: 1 }}
                            fullWidth
                            label="Phone"
                            name="phone"
                            type="number"
                            value={phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Grid>

                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Company"
                          name="company"
                          value={company}
                          onChange={handleInputChange}
                        ></TextField>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="PAN Number"
                          name="pan"
                          value={pan}
                          onChange={handleInputChange}
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Box
                        sx={{ mt: 2 }}
                        display="flex"
                        justifyContent="flex-end"
                      >
                        {step < 2 && (
                          <Button
                            color="primary"
                            variant="contained"
                            align="right"
                            onClick={handleNext}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </CardContent>
                  <Divider />
                </Card>
              </form>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Box>
              <div style={{ minWidth: "100%", marginBottom: "1rem" }}>
                <form>
                  <Card>
                    <CardHeader title="Create new account" />
                    <CardContent sx={{ pt: 0 }}>
                      <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="GST Number"
                            name="gstn"
                            value={gstn}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Type"
                            name="type"
                            value={type}
                            select
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            onChange={handleInputChange}
                          >
                            {customerType.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid xs={12} md={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            multiline
                            rows={2}
                            value={address}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            select
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            defaultValue=""
                            value={currentCountry}
                            onChange={handleCountry}
                          >
                            {userOptionsCountry?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="State"
                            name="state"
                            select
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            defaultValue=""
                            value={currentState}
                            onChange={handleState}
                            onFocus={handleDefaultState}
                          >
                            {userOptionsState?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            select
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            defaultValue=""
                            value={currentCity}
                            onChange={handleCities}
                          >
                            {userOptionsCities?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Zip Code"
                            name="zipcode"
                            value={zipcode}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmpassword"
                            type="password"
                            value={confirmPassword}
                            onChange={handleInputChange}
                          ></TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <div>
                            <div style={{ display: "inline-block" }}>
                              <Button
                                color="primary"
                                variant="contained"
                                align="right"
                                onClick={() =>
                                  document.getElementById("upload").click()
                                }
                              >
                                Upload Company Logo
                              </Button>
                              {uploadFile && (
                                <Button
                                  color="secondary"
                                  onClick={() => handleDeleteFile("upload")}
                                  startIcon={<Delete />}
                                  sx={{ color: "grey" }}
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                            <input
                              type="file"
                              id="upload"
                              onChange={handleUploadChange}
                              style={{ display: "none" }}
                            />
                          </div>
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            File must be in PNG/JPEG format
                          </Typography>
                        </Grid>
                      </Grid>
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
                    <Divider />
                  </Card>
                </form>
                <Grid xs={12} md={6}>
                  <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
                    <Button
                      color="primary"
                      variant="contained"
                      align="right"
                      onClick={handleToHome}
                      href={paths.index}
                      type="submit"
                    >
                      Save
                    </Button>
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
                  </Box>
                </Grid>
              </div>
            </Box>
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
            alignItems: "center",
            backgroundColor: "neutral.800",
            backgroundImage: 'url("/assets/gradient-bg.svg")',
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            color: "common.white",
            display: "flex",
            flex: {
              xs: "0 0 auto",
              md: "1 1 auto",
            },
            justifyContent: "center",
            p: {
              xs: 4,
              md: 8,
            },
            position: "sticky",
            top: 0,
          }}
        >
          <Box maxWidth="md">
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={4}
              sx={{
                color: "text.primary",
                "& > *": {
                  color: "neutral.400",
                  flex: "0 0 auto",
                },
              }}
            >
              <img
                alt=""
                src={images[currentImage]}
                style={{ width: 450, height: "auto" }}
              />
            </Stack>
          </Box>
        </Box>
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
              md: 750,
            },
            overflowY: "hidden",
          }}
        >
          {renderFormStep()}
        </Box>
      </Box>
    </>
  );
};

export default Register;
