
import {
  Typography,
  IconButton,
  Icon,
  Link,
  MenuItem,
  TextField,
  InputBase,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
  import { Table } from 'antd';
  import './purchase-order.css'
  import { Box } from '@mui/system';
  import React from 'react';
  import { Scrollbar } from 'src/components/scrollbar';
  import EditIcon from '@mui/icons-material/Edit';
  import {  Delete } from '@mui/icons-material';
  import IconWithPopup from '../user/user-icon';
  import axios from 'axios';
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import SearchIcon from '@mui/icons-material/Search';
  import HighlightOffIcon from '@mui/icons-material/HighlightOff';
  import { apiUrl } from 'src/config';
import Logo from '../logo/logo';
  import CircularProgress from "@mui/material/CircularProgress";
  
  const userId = sessionStorage.getItem('user') || localStorage.getItem('user');
  
  
  const WorkOrderViewTable = () => {
    const [userData, setUserData]= useState([])
  
  
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] =useState(true)
        const [selectedProductId, setSelectedProductId] = useState(null);
  
  
    const navigate = useNavigate();
    
   
    useEffect(() => {
      axios.get(apiUrl +`getAllWorkOrders/${userId}`)
        .then(response => {
          setUserData(response.data);
          setLoading(false)
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
  
    const updatedData = userData?.map((item) => {
      return {
        ...item,
        companyName: item?.noncompany?.companyName || item?.company?.companyName
      };
    });
  
    function formatDate(dateString) {
      const parsedDate = new Date(dateString);
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
  
    const formattedArray = updatedData?.map((item) => {
      const formattedItem = { ...item }; 
    
      if (formattedItem.createdDate) {
        formattedItem.originalcreatedDate =formattedItem.createdDate
        formattedItem.createdDate = formatDate(formattedItem.createdDate);
      }
    
      if (formattedItem.lastModifiedDate) {
        formattedItem.lastModifiedDate = formatDate(formattedItem.lastModifiedDate);
      }
    
      if (formattedItem.startdate) {
        formattedItem.startdate = formatDate(formattedItem.startdate);
      }
      if (formattedItem.enddate) {
        formattedItem.enddate = formatDate(formattedItem.enddate);
      }
    
    
      return formattedItem;
    });
  
    const dataWithKeys = formattedArray
    ?.filter(item => item.category === "workorder")
    .map(item => ({ ...item, key: item.id }));
  
  
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
          await axios.delete(
            apiUrl + `deleteWorkOrderById/${selectedProductId}`
          );
          const updatedRows = userData.filter(
            (item) => item.id !== selectedProductId
          );
          setUserData(updatedRows);
          notify(
            "success",
            `Sucessfully deleted row with work order number: ${selectedProductId}.`
          );
        } catch (error) {
          console.error("Error deleting row:", error.message);
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
    
    const handleNavigation = record => {
  
      navigate('/dashboard/services/workorderedit', { state: record });
   
    };
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
  
    
  const filteredList = dataWithKeys.filter(product => {
    const companyMatch = product?.companyName?.toLowerCase().includes(searchText.toLowerCase());
   
    return companyMatch
  });
  
  
  
    const columns = [
      {
        title: (
          <div
            style={{
              display: "flex",
              alignItems: "center",

            }}
          >
            Work Order Number
          </div>
        ),
        dataIndex: "id",
        key: "id",
        render: (name, record) => {
          const handleNavigation = () => {
            navigate("/dashboard/services/workorderDetail", { state: record });
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
              <Typography variant="subtitle1">WO:{name}</Typography>
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
        title: "Order Modified Date",
        key: "lastModifiedDate",
        dataIndex: "lastModifiedDate",
      },
      {
        title: "Order Date",
        key: "createdDate",
        dataIndex: "createdDate",
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
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
          <IconButton onClick={() => handleNavigation(record)}>
            <Icon>
              <EditIcon />
            </Icon>
          </IconButton>
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
            <h2 style={{ margin: 0 }}>View Work Order</h2>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <Logo />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <IconWithPopup />
          </div>
        </div>

        <Box
          sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}
        >
          {loading === false ? (
            <Scrollbar>
              <Table
                sx={{ minWidth: 800, overflowX: "auto" }}
                columns={columns}
                dataSource={filteredList}
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
              Are you sure you want to delete this work order?
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
      </div>
    );
      };
      
      export default  WorkOrderViewTable;