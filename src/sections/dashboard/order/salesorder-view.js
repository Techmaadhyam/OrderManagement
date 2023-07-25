import PropTypes from "prop-types";
import {
  Card,
  Divider,
  Typography,
  Link,
  SvgIcon,
  Grid,
  Icon,
  IconButton,
  TextField,
} from "@mui/material";
import "./sales-order.css";
import { Box } from "@mui/system";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useState } from "react";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { Scrollbar } from "src/components/scrollbar";
import { Table } from "antd";
import { primaryColor } from "src/primaryColor";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import IconWithPopup from "../user/user-icon";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { apiUrl } from "src/config";
import { useNavigate } from "react-router-dom";
import Logo from "../logo/logo";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

export const ViewSalesOrder = (props) => {
  const location = useLocation();
  const state = location.state;

  console.log(state);

  const [tempuser, setTempuser] = useState([]);
  const [rowData, setRowData] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [paidAmount, setPaidAmount] = useState(
    state?.paidamount || state?.soRecord?.paidamount || 0
  );
  const [tempId, setTempId] = useState(state?.tempUser?.id);
  const [userState, setUserState] = useState(state?.companyuser?.id);
  const [updatedRows, setUpdatedRows] = useState([]);

  const navigate = useNavigate();

  const align = "horizontal";

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const convertedArray = updatedRows.map((obj) => {
    return {
      inventory: { id: obj.inventoryId },
      sgst: obj.sgst,
      igst: obj.sgst,
      cgst: obj.cgst,
      discountpercent: obj.discountpercent,
      weight: obj.weight,
      price: obj.price,
      description: obj.description,
      comments: state?.comments,
      size: obj.size,
      salesOrderId: obj.salesOrderId,
      quantity: obj.quantity,
      createdDate: obj.createdDate,
      createdBy: userId,
      lastModifiedDate: obj.lastModifiedDate,
      id: obj.id,
    };
  });
  const handleSaveClick = async () => {
    setIsEditable(false);
    if (paidAmount) {
      try {
        const response = await fetch(apiUrl + "createSalesOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salesOrder: {
              id: state?.id,
              ...(state?.quotid && {
                quotid: state?.quotid,
              }),
              ...(tempId && { tempUser: { id: tempId } }),
              ...(userState && { companyuser: { id: userState } }),
              contactPerson: state?.contactPerson,
              contactPhone: state?.contactPhone,
              status: state?.status,
              paymentMode: state?.paymentMode,
              type: state?.type,
              deliveryDate: state?.originalDeliveryDate,
              deliveryAddress: state?.deliveryAddress,
              city: state?.city,
              state: state?.state,
              country: state?.country,
              pinCode: state?.pinCode,
              createdBy: userId,
              lastModifiedDate: new Date(),
              createdDate: state?.originalcreatedDate,
              comments: state?.comments,
              paidamount: paidAmount,
              termsAndCondition: state?.termsAndCondition,
              modeofdelivery: state?.modeofdelivery,
              totalAmount: state?.totalAmount,
              totalcgst: state?.totalcgst,
              totalsgst: state?.totalsgst,
              totaligst: state?.totaligst,
              totalcost: state?.totalcost,
              lastModifiedByUser: { id: parseFloat(userId) },
            },
            salesOrderDetails: convertedArray,
          }),
        });

        if (response.ok) {
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  useEffect(() => {
    axios
      .get(
        apiUrl +
          `getTempUserById/${
            state?.tempUserId || state?.soRecord?.tempUserId || state?.userId
          }`
      )
      .then((response) => {
        setTempuser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.tempUserId, state?.soRecord?.tempUserId, state?.userId]);

  useEffect(() => {
    axios
      .get(
        apiUrl + `getAllSalesOrderDetails/${state?.id || state?.soRecord?.id}`
      )
      .then((response) => {
        const modifiedData = response.data.map((item) => {
          const { quantity, price, cgst, igst, sgst, discountpercent } = item;
          const netAmount =
            quantity * price +
            (quantity * price * cgst) / 100 +
            (quantity * price * igst) / 100 +
            (quantity * price * sgst) / 100;

          const discountedAmount =
            netAmount - (netAmount * discountpercent) / 100;

          return {
            ...item,
            netAmount: parseFloat(discountedAmount.toFixed(2)),
          };
        });

        const updatedData = modifiedData.map((obj) => {
          let parsedInventory;
          try {
            parsedInventory = obj.inventory;
          } catch (error) {
            console.error(
              "Error parsing inventory JSON for object:",
              obj,
              error
            );
          }

          return {
            ...obj,
            inventoryId: parsedInventory.id,
            productId: parsedInventory?.product?.id,
          };
        });

        setRowData(updatedData);
        setUpdatedRows(updatedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.id, state?.soRecord?.id]);

  console.log(rowData);

  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const formattedDate = formatDate(state?.soRecord?.deliveryDate);

  const columns = [
    {
      title: "Part Description",
      dataIndex: "description",
      key: "description",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/inventory/viewDetail/${record.inventoryId}`, {
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
            <Typography variant="subtitle2">{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },

    {
      title: "Cost",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "CGST",
      key: "cgst",
      dataIndex: "cgst",
    },
    {
      title: "SGST",
      key: "sgst",
      dataIndex: "sgst",
    },
    {
      title: "IGST",
      key: "igst",
      dataIndex: "igst",
    },
    {
      title: "Net Amount",
      key: "netAmount",
      dataIndex: "netAmount",
    },
  ];

  return (
    <div style={{ minWidth: "100%", marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.orders.details}
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
                Sales Order List
              </span>
            </Typography>
          </Link>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <h2>Sales Order</h2>
      <Card style={{ marginBottom: "12px" }}>
        <PropertyList>
          <PropertyListItem align={align} label="Username">
            <Typography variant="subtitle2">
              {(state?.createdByUser?.firstName ||
                state?.soRecord?.createdByUser?.firstName) +
                " " +
                (state?.createdByUser?.lastName ||
                  state?.soRecord?.createdByUser?.lastName)}
            </Typography>
          </PropertyListItem>
          <Divider />
          <PropertyListItem
            align={align}
            label="Sales Order Number"
            value={String(state?.id || state?.soRecord?.id)}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Quotation"
            value={String(state?.quotid || state?.soRecord?.quotid || "Empty")}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Mode Of Delivery "
            value={state?.modeofdelivery || state?.soRecord?.modeofdelivery}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Delivery Date"
            value={state?.deliveryDate || formattedDate}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Contact Name"
            value={state?.contactPerson || state?.soRecord?.contactPerson}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Contact No"
            value={state?.contactPhone || state?.soRecord?.contactPhone}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Status"
            value={state?.status || state?.soRecord?.status}
          ></PropertyListItem>
        </PropertyList>
        <Divider />
      </Card>
      <Card style={{ marginBottom: "40px" }}>
        <Box
          sx={{ position: "relative", overflowX: "auto", marginBottom: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              pagination={false}
              columns={columns}
              dataSource={rowData?.map((row) => ({ ...row, key: row.id }))}
            ></Table>
          </Scrollbar>
        </Box>
        <Grid>
          <Typography
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginLeft: "10px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Total Amount : ₹{state?.totalAmount || state?.soRecord?.totalAmount}
          </Typography>
        </Grid>
        {!state?.soRecord && (
          <Grid style={{ marginTop: "20px" }}>
            <Typography
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "14px",
                display: "flex",
                marginLeft: "10px",
                color: "black",
                fontWeight: "bold",
                alignItems: "center",
              }}
            >
              Paid Amount : ₹
              {isEditable ? (
                <TextField
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  style={{
                    width: "100px",
                    height: "40px",
                    marginLeft: "10px",
                  }}
                />
              ) : (
                <span>{paidAmount}</span>
              )}
              {isEditable ? (
                <IconButton onClick={handleSaveClick}>
                  <Icon>
                    <SaveIcon />
                  </Icon>
                </IconButton>
              ) : (
                <IconButton onClick={handleEditClick}>
                  <Icon>
                    <EditIcon />
                  </Icon>
                </IconButton>
              )}
            </Typography>
          </Grid>
        )}
        <Grid style={{ marginTop: "20px" }}>
          <Typography
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginLeft: "10px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Terms &Conditions :{" "}
            {state?.termsAndCondition || state?.soRecord?.termsAndCondition}
          </Typography>
        </Grid>
        <Grid style={{ marginTop: "20px", marginBottom: "30px" }}>
          <Typography
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginLeft: "10px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Comments: {state?.comments || state?.soRecord?.comments}{" "}
          </Typography>
        </Grid>
        <Divider />
      </Card>
    </div>
  );
};

ViewSalesOrder.propTypes = {
  customer: PropTypes.object.isRequired,
};
