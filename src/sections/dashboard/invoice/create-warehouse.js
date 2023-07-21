import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import "./warehouse.css";
import { Box } from "@mui/system";
import IconWithPopup from "../user/user-icon";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchAccessToken,
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchIndianStates,
} from "src/utils/api-service";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

export const CreateWarehouse = (props) => {
  // country, state, city API access token
  const [accessToken, setAccessToken] = useState(null);

  //state management for countries,states and cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("India");
  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  //form state handling

  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [description, setDescription] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");

  ////
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "name":
        setUsername(value);
        break;
      case "contactname":
        setContactName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "zipcode":
        setZipcode(value);
        break;
      case "description":
        setDescription(value);
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

  //getting current date
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}/${month}/${day}`;
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

  //for sending response body via route
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    if (
      username &&
      contactName &&
      phone &&
      currentCountry &&
      currentState &&
      address &&
      userId &&
      description &&
      currentCity &&
      zipcode &&
      currentDate
    ) {
      try {
        const response = await fetch(apiUrl + "addWareHouse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            contactName: contactName,
            phone: phone,
            address: address,
            description: description,
            zipcode: zipcode,
            city: currentCity,
            state: currentState,
            country: currentCountry,
            createdBy: userId,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
          }),
        });

        if (response.ok) {
          // Redirect to home page upon successful submission

          response.json().then((data) => {
            console.log(data);
            navigate("/dashboard/invoices/viewDetail", { state: data });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    } else {
      notify("error", "Please fill all the fields marked with *.");
    }
  };

  return (
    <div style={{ minWidth: "100%", marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Create Warehouse</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>

      <form>
        <Card>
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
          <CardHeader title="Warehouse Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={username}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid />
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  required
                  rows={2}
                  value={address}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}></Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warehouse Incharge Name"
                  name="contactname"
                  required
                  value={contactName}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  required
                  type="number"
                  value={phone}
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
                  required
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
                  required
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
                  required
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
                  required
                  value={zipcode}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                required
                multiline
                rows={4}
                maxRows={6}
                value={description}
                onChange={handleInputChange}
              />
            </Grid>
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
            onClick={handleClick}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

CreateWarehouse.propTypes = {
  customer: PropTypes.object.isRequired,
};
