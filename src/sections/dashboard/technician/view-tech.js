
import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link,
  InputBase,
} from '@mui/material';
import { Table } from 'antd';
import { Box } from '@mui/system';
import React from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import EditIcon from '@mui/icons-material/Edit';
import {  Delete } from '@mui/icons-material';
import IconWithPopup from '../user/user-icon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './customer.css'
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';
import CircularProgress from "@mui/material/CircularProgress";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem , CardContent} from '@mui/material';

  //get userid 
  const userId = sessionStorage.getItem('user') || localStorage.getItem('user');






const ViewTechnician = () => {

  const [userData, setUserData]= useState([])

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [selectedType, setSelectedType] = useState('Technician');
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();
  
 
  useEffect(() => {
    axios.get(apiUrl +`getAllTempUsers/${userId}`)
      .then(response => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));


const filteredList = dataWithKeys?.filter(product => {
    const companyMatch = product.companyName.toLowerCase().includes(searchText.toLowerCase());
   
    return companyMatch
});

const filteredData = selectedType && selectedType === 'Technician'
  ? filteredList.filter(item => item.type === 'Technician')
  : [];



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

  
    const handleRemoveRow = async () => {
      try {
        await axios.delete(apiUrl + `deleteTempUserId/${selectedProductId}`);
        const updatedRows = userData.filter(
          (item) => item.id !== selectedProductId
        );
        setUserData(updatedRows);
        notify("success", `Sucessfully deleted technician row.`);
      } catch (error) {
        console.error("Error deleting row:", error.message);
        notify("error", `This record is linked with Work Order or AMC.`);
      }
      setOpen(false);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleConfirmDelete = (productId) => {
      setSelectedProductId(productId);
      setOpen(true);
    };

const handleEditRecord = (record) => {
  setEditRecord(record);
  setPopupVisible(true);
};

const handleSaveRecord = async (editedRecord) => {

  console.log('Saving edited record:', editedRecord);
  console.log(JSON.stringify({

    id: editedRecord.id,
    firstName : editedRecord.firstName,
    lastName: editedRecord.lastName,
    userName: editedRecord.emailId,
    companyName: editedRecord.companyName,
    emailId: editedRecord.emailId,
    mobile: editedRecord.mobile,
    address: editedRecord.address,
    type: editedRecord.type,
    pincode: editedRecord.pincode,
    city: editedRecord.city,
    gstNumber: editedRecord.gstNumber,
    state: editedRecord.state,
    country: editedRecord.country,
    createdBy: editedRecord.createdBy,
    lastModifiedDate: currentDate
  }))

  if (currentDate) {
    try {
      const response = await fetch(apiUrl +'addTempUser', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json'
        },
        body: JSON.stringify({

          id: editedRecord.id,
          firstName : editedRecord.firstName,
          lastName: editedRecord.lastName,
          userName: editedRecord.userName,
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
          createdByUser: {id: editedRecord.createdByUser.id},
          lastModifiedDate: new Date(),
          lastModifiedByUser: {id: userId},
        })
      });
      
      if (response.ok) {
       response.json().then(data => {
        console.log(data);
        window.location.reload()
       
});
      } 
    } catch (error) {
      console.error('API call failed:', error);
    }
  } 

};


//Get date
useEffect(() => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;
  setCurrentDate(formattedDate);
}, []);



//company search
const handleCompanyClick = () => {
  setIsSearching(true);
};

const handleCompanyInputChange = event => {
  setSearchText(event.target.value);
};

const handleCompanyCancel = () => {
  setIsSearching(false);
  setSearchText('');
};


  
 
  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate("/dashboard/services/technicianDetail", { state: record });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
              textAlign: "center",
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
      title: "Type",
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
        <IconButton onClick={() => handleConfirmDelete(row.id)}>
          <Icon>
            <Delete />
          </Icon>
        </IconButton>
      ),
    },
  ];

  const PopupComponent = ({ record, onClose, onSave }) => {
    const [editedRecord, setEditedRecord] = useState(record);

    const handleChange = (event) => {
      const { name, value } = event.target;
      setEditedRecord((prevRecord) => ({
        ...prevRecord,
        [name]: value,
      }));
    };

    const handleSave = () => {
      onSave(editedRecord);
      onClose();
    };

    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Edit Technician</DialogTitle>
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
                fullWidth
                value={editedRecord.emailId}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Type"
                name="type"
                fullWidth
                value={editedRecord.type}
              ></TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Company"
                name="companyName"
                fullWidth
                value={editedRecord.companyName}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="GST Number"
                name="gstn"
                fullWidth
                value={editedRecord.gstNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Country"
                name="country"
                fullWidth
                value={editedRecord.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="State"
                name="state"
                fullWidth
                value={editedRecord.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="City"
                name="city"
                fullWidth
                value={editedRecord.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={12}>
              <TextField
                label="Address"
                name="address"
                multiline
                rows={2}
                value={editedRecord.address}
                onChange={handleChange}
                fullWidth
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
          <h2 style={{ margin: 0 }}>View Technician</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <Box sx={{ position: "relative", overflowX: "auto" }}>
        {userData.length !== 0 ? (
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
        {open && (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this technician?
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
      </Box>
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
    
    export default ViewTechnician;
