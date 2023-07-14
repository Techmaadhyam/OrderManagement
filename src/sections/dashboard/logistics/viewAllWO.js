import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link,
  InputBase,
  Card,
  CardHeader,
  SvgIcon,
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
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { primaryColor } from "src/primaryColor";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useLocation } from "react-router-dom";


//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const ViewTemporaryUser = () => {
  const location = useLocation();
  const navigate =useNavigate()
  const state = location.state;

  const [wo, setWo] = useState([]);

  const workColumn = [
    {
      title: "Sales Order Number",
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
      title: "Company Name",
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
  ];

  const align = "horizontal";

  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          apiUrl +
            `getRecordBasedOnCustomerId/${userId}/${state?.id}/${state?.month}/${state?.year}`
        )
        .then((response) => {
          let woList = [
            ...response.data.workOrderList.slice(-4).map((obj) => ({
              ...obj,
              lastModifiedDate: formatDate(obj.lastModifiedDate),
              createdDate: formatDate(obj.createdDate),

              companyName:
                obj.noncompany?.companyName || obj.company?.companyName,
              category: "woList",
            })),
          ];

          setWo(woList);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchData();
  }, [userId, state]);

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
          <Link
            color="text.primary"
            component={RouterLink}
            onClick={() => navigate(-1)}
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
                Customer / Vendor Page
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
      <Card>
        <CardHeader title="View Customer / Vendor Work Order" />
        <Box sx={{ position: "relative", overflowX: "auto" }}>
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={workColumn}
              dataSource={wo}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        </Box>
      </Card>
    </div>
  );
};

export default ViewTemporaryUser;
