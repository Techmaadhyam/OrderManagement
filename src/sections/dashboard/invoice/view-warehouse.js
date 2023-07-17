import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link,
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
import "./warehouse.css";
import { apiUrl } from "src/config";
import DownloadIcon from "@mui/icons-material/Download";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../pdfAssets/vfs_fonts";
import Logo from "../logo/logo";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Helvetica: {
    normal: "Helvetica.ttf",
    bold: "Helvetica-Bold.ttf",
  },
};

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const ViewWarehouse = () => {
  const [userData, setUserData] = useState([]);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(apiUrl + `getAllWareHouse/${userId}`)
      .then((response) => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));

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
      await axios.delete(apiUrl + `deleteWareHouseById/${selectedProductId}`);
      const updatedRows = userData.filter(
        (item) => item.id !== selectedProductId
      );
      setUserData(updatedRows);
      notify("success", `Sucessfully deleted warehouse row.`);
    } catch (error) {
      console.error("Error deleting row:", error.message);
      notify("error", `This record is linked with an Inventory.`);
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
    if (currentDate) {
      try {
        const response = await fetch(apiUrl + "addWareHouse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editedRecord.id,
            name: editedRecord.name,
            description: editedRecord.description,
            contactName: editedRecord.contactName,
            address: editedRecord.address,
            zipcode: editedRecord.zipcode,
            city: editedRecord.city,
            state: editedRecord.state,
            country: editedRecord.country,
            createdBy: userId,
            lastModifiedDate: new Date(),
          }),
        });

        if (response.ok) {
          response.json().then((data) => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  //Get date
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}/${month}/${day}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleWarehouseDownload = async (record) => {
    const date = new Date().toLocaleDateString("IN");
    //heading
    const heading = {
      text: "Warehouse Details",
      font: "Helvetica",
      style: "header",
      margin: [0, 0, 0, 10],
    };

    //content
    const recordDetails = [
      {
        text: "Warehouse Name: " + record.name,
        font: "Helvetica",
        margin: [0, 0, 0, 5],
      },
      {
        text:
          "Address: " +
          record.address +
          ", " +
          record.city +
          ", " +
          record.state +
          ", " +
          record.country,
        font: "Helvetica",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Zip Code: " + record.zipcode,
        font: "Helvetica",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Description: " + record.description,
        font: "Helvetica",
        margin: [0, 0, 0, 5],
      },
    ];

    //title
    const inventoryTitle = {
      text: "Warehouse Inventory",
      font: "Helvetica",
      style: "subheader",
      margin: [0, 20, 0, 10],
    };

    const inventoryData = await fetchInventoryData(record.id);
    // inventory table
    const inventoryTable = {
      table: {
        headerRows: 1,
        font: "Helvetica",
        widths: [60, 40, "*", "*", 30, "auto", "auto", "auto", "auto", 100],
        body: [
          [
            { text: "Part Name", bold: true },
            { text: "Rack", bold: true },
            { text: "Quantity", bold: true },
            { text: "Weight", bold: true },
            { text: "Size", bold: true },
            { text: "Cost", bold: true },
            { text: "CGST", bold: true },
            { text: "SGST", bold: true },
            { text: "IGST", bold: true },
            { text: "Description", bold: true },
          ],
          ...inventoryData.map((item) => [
            item.product.productName,
            item.rack.name,
            item.quantity,
            item.weight,
            item.size,
            item.price,
            item.cgst,
            item.sgst,
            item.igst,
            item.description,
          ]),
        ],
      },
      layout: {
        defaultBorder: true,
        font: "Helvetica",
        fillColor: function (i) {
          return i % 2 === 0 ? "#F0F0F0" : null;
        },
      },
    };

    // Define the document structure
    const docDefinition = {
      content: [heading, ...recordDetails, inventoryTitle, inventoryTable],
      header: {
        margin: [0, 20, 30, 0],
        text: "Date: " + date, //add today's date
        alignment: "right",
        border: [false, false, false, true], // Add a bottom border to the cell
      },
      defaultStyle: {
        font: "Helvetica",
        fontSize: 10,
      },
      styles: {
        header: {
          font: "Helvetica",
          fontSize: 14,
          bold: true,
          alignment: "center",
        },
        subheader: {
          font: "Helvetica",
          fontSize: 14,
          bold: true,
          alignment: "left",
        },
      },
      pageMargins: [40, 40, 40, 60],
    };

    //generate pdf
    pdfMake.createPdf(docDefinition).download("warehouse_details.pdf");
  };

  const fetchInventoryData = async (warehouseId) => {
    try {
      const response = await axios.get(
        apiUrl + `getInventoryByWareHouseId/${warehouseId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Warehouse Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/invoices/viewDetail`, { state: record });
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
      title: "Address",
      key: "address",
      dataIndex: "address",
      render: (text, record) => `${text}, ${record.city}, ${record.state}`,
    },
    {
      title: "Zip Code",
      key: "zipcode",
      dataIndex: "zipcode",
    },
    {
      title: "Incharge Name",
      key: "contactName",
      dataIndex: "contactName",
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
    {
      title: "Warehouse Details",
      dataIndex: "actionDownload",
      key: "actionDownload",
      render: (_, record) => (
        <IconButton onClick={() => handleWarehouseDownload(record)}>
          <Icon>
            <DownloadIcon />
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
        <DialogTitle>Edit Warehouse</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                label="Warehouse Name"
                name="name"
                value={editedRecord.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Zip Code"
                name="zipcode"
                value={editedRecord.zipcode}
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
            <Grid xs={12} md={6}>
              <TextField
                label="Description"
                name="description"
                value={editedRecord.description}
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
          <h2 style={{ margin: 0 }}>View Warehouse</h2>
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
              dataSource={dataWithKeys}
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
            Are you sure you want to delete this warehouse?
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

export default ViewWarehouse;
