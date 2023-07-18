import { socialApi } from "src/api/social";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useContext } from "react";
import { LogoContext } from "src/utils/logoContext";
import PropTypes from "prop-types";

import {
  Card,
  CardHeader,
  Divider,
  Typography,
  Link,
  SvgIcon,
  Container,
  Stack,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { RouterLink } from "src/components/router-link";
import { primaryColor } from "src/primaryColor";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useLocation } from "react-router-dom";
import User from "src/sections/dashboard/user/user-icon";
import Logo from "src/sections/dashboard/logo/logo";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import { apiUrl } from "src/config";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useEffect } from "react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { users } from "src/api/auth/data";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";

const mail = sessionStorage.getItem("mail");

export const Page = () => {
  const { logo } = useContext(LogoContext);

  //logout
  const handleLogout = () => {
    // Clear the session storage
    sessionStorage.clear();
    localStorage.removeItem("accessToken");
    const broadcastChannel = new BroadcastChannel("logoutChannel");
    broadcastChannel.postMessage("logout");
    window.location.href = paths.index;
  };

  const [logoPreview, setLogoPreview] = useState(null);
  const [logo1, setLogo1] = useState();
  const [userData, setUserData] = useState();
  const [editMode, setEditMode] = useState(false);
  //handle file uploads
  const [uploadFile, setUploadFile] = useState(null);
  const [modifiedValues, setModifiedValues] = useState();
  const handleEditClick = () => {
    setEditMode(true);
  };
  useEffect(() => {
    setModifiedValues((prevValues) => ({
      ...prevValues,
      id: userData?.id,
      password: userData?.password,
      companyName: userData?.companyName,
      userName: userData?.emailId,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      emailId: userData?.emailId,
      mobile: userData?.mobile,
      address: userData?.address,
      city: userData?.city,
      state: userData?.state,
      country: userData?.country,
      type: userData?.type,
      issuperuser: userData?.issuperuser,
      isactive: userData?.isactive,
      gstNumber: userData?.gstNumber,
      pandcard: userData?.pandcard,
      createdDate: userData?.createdDate,
      pincode: userData?.pincode,
      updatedDate: new Date(),
    }));
  }, [userData]);

  const handleCancelClick = () => {
    setEditMode(false);
    // Reset modified values to original state values
    setModifiedValues({
      id: userData?.id,
      password: userData?.password,
      companyName: userData?.companyName,
      userName: userData?.emailId,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      emailId: userData?.emailId,
      mobile: userData?.mobile,
      address: userData?.address,
      city: userData?.city,
      state: userData?.state,
      country: userData?.country,
      type: userData?.type,
      isactive: userData?.isactive,
      issuperuser: userData?.issuperuser,
      gstNumber: userData?.gstNumber,
      pandcard: userData?.pandcard,
      createdDate: userData?.createdDate,
      pincode: userData?.pincode,
      updatedDate: new Date(),
    });
  };

  useEffect(() => {
    axios
      .get(apiUrl + `getUserByUsername/${mail}`)
      .then((response) => {
        setUserData(response.data.loggedIUser[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(apiUrl + `getUserLogo/${userData?.id}`)
      .then((response) => {
        setLogo1(response.data[0]);
        console.log(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userData]);

  console.log(modifiedValues);

  const handleSaveClick = async () => {
    if (userData?.id) {
      try {
        const response = await fetch(apiUrl + "addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedValues),
        });

        if (response.ok) {
          setEditMode(false);

          response.json().then(async (data) => {
            setUserData(data);

            if (uploadFile) {
              const formData = new FormData();

              let jsonBodyData = {};

              let file = uploadFile;

              jsonBodyData.fileName = "companylogo";
              jsonBodyData.fileType = uploadFile?.type;
              jsonBodyData.createdbyid = data.id;
              jsonBodyData.lastmodifybyid = null;
              jsonBodyData.createdDate = data.createdDate;
              jsonBodyData.lastModifiedDate = new Date();
              if (logo1?.id) {
                jsonBodyData.fileId = logo1.id;
              }

              formData.append("file", file);
              formData.append("fileWrapper", JSON.stringify(jsonBodyData));

              try {
                const uploadResponse = await fetch(apiUrl + "upload", {
                  method: "POST",
                  body: formData,
                });

                if (uploadResponse.ok) {
                  window.location.reload();
                } else {
                  console.error("Logo upload failed");
                }
              } catch (error) {
                console.error(error);
              }
            }
          });
          alert("userdata update success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUploadChange = (event) => {
    const file = event.target.files[0];

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setUploadFile(file);
      // Perform necessary operations with the file, such as saving or previewing
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
        setLogoPreview(null);
        document.getElementById("upload").value = "";
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModifiedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const align = "horizontal";

  return (
    <>
      <Seo title="Dashboard: Social Profile" />
      <CardHeader
        title="Your Profile Details"
        titleTypographyProps={{ variant: "h5" }}
        action={
          // <SvgIcon onClick={handleLogout} sx={{ fontSize:  '2.5rem', cursor: 'pointer'}}>
          //   <ManageAccountsTwoToneIcon />
          // </SvgIcon>

          <Button color="primary" variant="contained" onClick={handleLogout}>
            Log Out
          </Button>
        }
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div style={{ minWidth: "100%", marginTop: "1rem" }}>
              <Card style={{ marginBottom: "12px" }}>
                <PropertyList>
                  <PropertyListItem>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {editMode ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              height: 70,
                              width: "auto",
                              ml: 0,
                              mt: 0,
                              mb: 0,
                              mr: 3,
                            }}
                            alt="logo"
                            src={
                              logoPreview
                                ? `${logoPreview}`
                                : `data:${logo1?.fileType};base64, ${logo1?.fileData}`
                            }
                          />
                          <Grid>
                            <div>
                              <div style={{ display: "inline-block" }}>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  align="right"
                                  sx={{
                                    borderRadius: "50%",
                                    minWidth: 40,
                                    minHeight: 40,
                                    width: 40,
                                    height: 40,
                                    p: 0,
                                  }}
                                  onClick={() =>
                                    document.getElementById("upload").click()
                                  }
                                >
                                  <FileUploadRoundedIcon />
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
                          </Grid>
                        </div>
                      ) : (
                        <Box
                          component="img"
                          sx={{
                            height: 70,
                            width: "auto",
                            ml: 0,
                            mt: 0,
                            mb: 0,
                            mr: 2,
                          }}
                          alt="logo"
                          src={`data:${logo1?.fileType};base64, ${logo1?.fileData}`}
                        />
                      )}
                      <Box>
                        {editMode && (
                          <Button
                            color="primary"
                            variant="contained"
                            align="right"
                            onClick={handleCancelClick}
                            sx={{ mr: 2 }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          color="primary"
                          variant="contained"
                          align="right"
                          onClick={handleEditClick}
                        >
                          Update Profile
                        </Button>
                      </Box>
                    </Box>
                  </PropertyListItem>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <PropertyListItem align={align} label="First name">
                        {editMode ? (
                          <TextField
                            name="firstName"
                            value={modifiedValues.firstName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="subtitle2">
                            {userData?.firstName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Email"
                        value={userData?.emailId}
                      >
                        {editMode ? (
                          <TextField
                            name="emailId"
                            value={modifiedValues.emailId}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.emailId}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Company"
                        value={userData?.companyName}
                      >
                        {editMode ? (
                          <TextField
                            name="companyName"
                            value={modifiedValues.companyName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.companyName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="GSTN NO"
                        value={userData?.gstNumber}
                      >
                        {editMode ? (
                          <TextField
                            name="gstNumber"
                            value={modifiedValues.gstNumber}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.gstNumber}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Type"
                        value={userData?.type}
                      >
                        {editMode ? (
                          <TextField
                            name="type"
                            value={modifiedValues.type}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.type}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Address"
                        value={userData?.address}
                      >
                        {editMode ? (
                          <TextField
                            name="address"
                            value={modifiedValues.address}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.address}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="State"
                        value={userData?.state}
                      >
                        {editMode ? (
                          <TextField
                            name="state"
                            value={modifiedValues.state}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.state}
                          </Typography>
                        )}
                      </PropertyListItem>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PropertyListItem
                        align={align}
                        label="Last name"
                        value={userData?.lastName}
                      >
                        {editMode ? (
                          <TextField
                            name="lastName"
                            value={modifiedValues.lastName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.lastName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Phone"
                        value={userData?.mobile}
                      >
                        {editMode ? (
                          <TextField
                            name="mobile"
                            value={modifiedValues.mobile}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.mobile}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="PAN"
                        value={userData?.pandcard}
                      >
                        {editMode ? (
                          <TextField
                            name="pandcard"
                            value={modifiedValues.pandcard}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.pandcard}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="City"
                        value={userData?.city}
                      >
                        {editMode ? (
                          <TextField
                            name="city"
                            value={modifiedValues.city}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.city}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Country"
                        value={userData?.country}
                      >
                        {editMode ? (
                          <TextField
                            name="country"
                            value={modifiedValues.country}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.country}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Pincode"
                        value={userData?.pincode}
                      >
                        {editMode ? (
                          <TextField
                            name="pincode"
                            value={modifiedValues.pincode}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {userData?.pincode}
                          </Typography>
                        )}
                      </PropertyListItem>
                      {/* <Grid xs={12} md={6}>
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
                      </Grid> */}
                    </Grid>
                  </Grid>

                  <Divider />
                  {editMode && (
                    <Box
                      sx={{ mt: 3, mb: 2 }}
                      display="flex"
                      justifyContent="flex-end"
                      marginRight="12px"
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        align="right"
                        onClick={handleSaveClick}
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </PropertyList>
              </Card>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
