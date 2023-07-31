import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link,
  InputBase,
} from "@mui/material";
import { Table } from "antd";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import IconWithPopup from "../user/user-icon";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./customer.css";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

//default customer type
const customerType = [
  {
    label: "Customer",
    value: "Customer",
  },
  {
    label: "Vendor",
    value: "Vendor",
  },
];

const ViewTemporaryUser = () => {
  //customer data
  const [userData, setUserData] = useState([]);

  //edit popup related states
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  //search bar related state
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedType, setSelectedType] = useState("");
  //state for confirm delete
  const [open, setOpen] = useState(false);
  //state for page load
  const [loading, setLoading] = useState(true);
  //customer id
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  //get all customers
  useEffect(() => {
    axios
      .get(apiUrl + `getAllTempUsers/${userId}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));

  //filter based on company name while searching
  const filteredList = dataWithKeys.filter((product) => {
    const companyMatch = product.companyName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return companyMatch;
  });

  //dont show onjects that has type= "Technician" since both tabs use same API
  const removeTechnician = filteredList.filter(
    (obj) => obj.type !== "Technician"
  );

  //customer type selection filter
  const filteredData = selectedType
    ? removeTechnician.filter((item) => item.type === selectedType)
    : removeTechnician;

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

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

  //delete row
  const handleRemoveRow = async () => {
    try {
      await axios.delete(apiUrl + `deleteTempUserId/${selectedProductId.id}`);
      const updatedRows = userData.filter(
        (item) => item.id !== selectedProductId.id
      );
      setUserData(updatedRows);
      notify("success", `Sucessfully deleted customer row.`);
    } catch (error) {
      console.error("Error deleting row:", error.message);
      if (selectedProductId.type === "Customer") {
        notify(
          "error",
          `This record is linked with Sales Order or Quotation or AMC.`
        );
      } else {
        notify(
          "error",
          `This record is linked with Purchase Order or Quotation.`
        );
      }
    }
    setOpen(false);
  };

  //close delete confirmation popup
  const handleClose = () => {
    setOpen(false);
  };
  //delete confirmation popup
  const handleConfirmDelete = (product) => {
    setSelectedProductId(product);
    setOpen(true);
  };
  //edit customer popup
  const handleEditRecord = (record) => {
    setEditRecord(record);
    setPopupVisible(true);
  };
  //submit edited customer
  const handleSaveRecord = async (editedRecord) => {
    if (editedRecord) {
      try {
        const response = await fetch(apiUrl + "addTempUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editedRecord.id,
            contactpersonname: editedRecord?.contactpersonname,
            userName: editedRecord.emailId,
            companyName: editedRecord.companyName,
            emailId: editedRecord.emailId,
            gstNumber: editedRecord.gstNumber,
            mobile: editedRecord.mobile,
            address: editedRecord.address,
            type: editedRecord.type,
            pincode: editedRecord.pincode,
            city: editedRecord.city,
            state: editedRecord.state,
            country: editedRecord.country,
            pandcard: editedRecord?.pandcard,
            createdByUser: { id: editedRecord.createdByUser.id },
            lastModifiedDate: new Date(),
            lastModifiedByUser: { id: userId },
          }),
        });

        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  //company search
  const handleCompanyClick = () => {
    setIsSearching(true);
  };

  const handleCompanyInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCompanyCancel = () => {
    setIsSearching(false);
    setSearchText("");
  };

  //render table title and body
  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Name
        </div>
      ),
      dataIndex: "userName",
      key: "userName",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/logistics/viewDetail`, { state: record });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isSearching ? (
            <>
              <Typography variant="subtitle2">Company Name</Typography>
              <IconButton onClick={handleCompanyClick}>
                <SearchIcon />
              </IconButton>
            </>
          ) : (
            <>
              <InputBase
                value={searchText}
                onChange={handleCompanyInputChange}
                placeholder="Search company..."
              />
              <IconButton onClick={handleCompanyCancel}>
                <Icon>
                  <HighlightOffIcon />
                </Icon>
              </IconButton>
            </>
          )}
        </div>
      ),
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
      render: (text, record) => `${text}, ${record.city}, ${record.state}`,
    },
    {
      title: "Email",
      key: "emailId",
      dataIndex: "emailId",
    },
    {
      title: (
        <TextField
          label="Type"
          name="type"
          sx={{ minWidth: 150 }}
          value={selectedType}
          onChange={handleTypeChange}
          select
          SelectProps={{
            MenuProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          {customerType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ),
      key: "type",
      dataIndex: "type",
    },

    {
      dataIndex: "actionEdit",
      key: "actionEdit",
      render: (_, record) => (
        <Link>
          <IconButton onClick={() => handleEditRecord(record)}>
            <Icon>
              <EditIcon />
            </Icon>
          </IconButton>
        </Link>
      ),
    },
    {
      dataIndex: "actionDelete",
      key: "actionDelete",
      render: (_, row) => (
        <IconButton onClick={() => handleConfirmDelete(row)}>
          <Icon>
            <Delete />
          </Icon>
        </IconButton>
      ),
    },
  ];

  //edit popup component
  const PopupComponent = ({ record, onClose, onSave }) => {
    const [editedRecord, setEditedRecord] = useState(record);

    // This function handles changes in form input elements and updates the "editedRecord" state.
    // It takes an "event" parameter representing the event triggered by user interaction with an input element.
    const handleChange = (event) => {
      // Extract the "name" and "value" properties from the event target (input element).
      const { name, value } = event.target;

      // Update the "editedRecord" state using the setter function.
      // The new state is created by spreading the previous "prevRecord" state to keep its existing values.
      // Then, the property specified by the "name" (derived from the input element) is updated with the new "value".
      setEditedRecord((prevRecord) => ({
        ...prevRecord,
        [name]: value,
      }));
    };
    //trigger submission of form
    const handleSave = () => {
      onSave(editedRecord);
      onClose();
    };

    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                label="Name"
                name="userName"
                fullWidth
                value={editedRecord.userName}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Email"
                name="emailId"
                value={editedRecord.emailId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Type"
                name="type"
                select
                SelectProps={{
                  MenuProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                value={editedRecord.type}
                onChange={handleChange}
                fullWidth
              >
                {customerType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Company"
                name="companyName"
                value={editedRecord.companyName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="GST Number"
                name="gstn"
                value={editedRecord.gstNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Country"
                name="country"
                value={editedRecord.country}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="State"
                name="state"
                value={editedRecord.state}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="City"
                name="city"
                value={editedRecord.city}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={12}>
              <TextField
                label="Address"
                name="address"
                value={editedRecord.address}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div style={{ minWidth: "100%" }}>
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
          <h2 style={{ margin: 0 }}>View Customer / Vendor</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>

      <Box sx={{ position: "relative", overflowX: "auto" }}>
        {loading === false ? (
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={columns}
              dataSource={filteredData}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </div>
        )}
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
      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            {selectedProductId.type.toLowerCase()}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRemoveRow} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isPopupVisible && editRecord && (
        <PopupComponent
          record={editRecord}
          onClose={() => setPopupVisible(false)}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default ViewTemporaryUser;
