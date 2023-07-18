import {
  Typography,
  IconButton,
  Icon,
  Link,
  InputBase,
  TextField,
  MenuItem,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Table } from "antd";
import "./purchase-order.css";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import IconWithPopup from "../user/user-icon";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import CircularProgress from "@mui/material/CircularProgress";

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

const userId = sessionStorage.getItem("user") || localStorage.getItem("user");
const PurchaseOrderViewForm = () => {
  const [userData, setUserData] = useState([]);
  const [userData1, setUserData1] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(apiUrl + `getAllPurchaseOrderByUser/${userId}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const formattedArray = userData?.map((item) => {
    const formattedItem = { ...item };

    if (formattedItem.createdDate) {
      formattedItem.originalcreatedDate = formattedItem.createdDate;
      formattedItem.createdDate = formatDate(formattedItem.createdDate);
    }

    if (formattedItem.lastModifiedDate) {
      formattedItem.lastModifiedDate = formatDate(
        formattedItem.lastModifiedDate
      );
    }

    if (formattedItem.deliveryDate) {
      formattedItem.originalDeliveryDate = formattedItem.deliveryDate;
      formattedItem.deliveryDate = formatDate(formattedItem.deliveryDate);
    }

    return formattedItem;
  });

  const dataWithKeys = formattedArray?.map((item) => ({
    ...item,
    companyName: item.tempUser?.companyName || item.companyuser?.companyName,
    key: item.id,
  }));

  


  //delete row
  const handleRemoveRow = async () => {
    try {
      await axios.delete(apiUrl + `deletePurchaseOrderId/${selectedProductId}`);
      const updatedRows = userData.filter((item) => item.id !== selectedProductId);
      setUserData(updatedRows);
      notify(
        "success",
        `Sucessfully deleted row with purchase order number: ${selectedProductId}.`
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

  const handleNavigation = (record) => {
    navigate("/dashboard/purchaseorder/edit", { state: record });
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

  const filteredList = dataWithKeys?.filter((product) => {
    const companyMatch = product.companyName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return companyMatch;
  });

  const filteredData = selectedType
    ? filteredList.filter((item) => item.type === selectedType)
    : filteredList;

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
 
          }}
        >
          Purchase Order Number
        </div>
      ),

      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/purchaseorder/viewDetail/${record.id}`, {
            state: record,
          });
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
            <Typography variant="subtitle1">PO:{name}</Typography>
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
      title: "Delivery Date",
      key: "deliveryDate",
      dataIndex: "deliveryDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
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
          <h2 style={{ margin: 0 }}>View Purchase Order</h2>
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
            Are you sure you want to delete this purchase order?
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

export default PurchaseOrderViewForm;
