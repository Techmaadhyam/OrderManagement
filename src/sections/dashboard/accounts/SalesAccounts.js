import React from "react";
import { useState, useEffect } from "react";
import { apiUrl } from "src/config";
import axios from "axios";
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
  Button
} from "@mui/material";
import { Table } from "antd";
import { Box } from "@mui/system";
import { Scrollbar } from "src/components/scrollbar";

const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const SalesAccounts = ({ year }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl + `getSalesOrderAccountingForMonthYear/${userId}/${year}`)
      .then((response) => {
        setUserData(response.data);
        // console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [year]);

  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const dataWithKeys = userData?.map((item) => ({
    ...item,
    companyName: item.tempUser?.companyName || item.companyuser?.companyName,
    gstn: item.tempUser?.gstNumber || item.companyuser?.gstNumber,
    pendingAmount: item.totalAmount - item.paidamount,
  }));

  const column = [
    {
      title: "Sl No",
      key: "slNo",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Order Date",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (text) => formatDate(text),
    },

    {
      title: "Invoice No",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "GSTIN",
      key: "gstn",
      dataIndex: "gstn",
    },

    {
      title: "Taxable Supply",
      key: "totalcost",
      dataIndex: "totalcost",
    },
    {
      title: "Total IGST",
      key: "totaligst",
      dataIndex: "totaligst",
    },
    {
      title: "Total CGST",
      key: "totalcgst",
      dataIndex: "totalcgst",
    },
    {
      title: "Total SGST",
      key: "totalsgst",
      dataIndex: "totalsgst",
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      dataIndex: "totalAmount",
    },
    {
      title: "Pending Amount",
      key: "pendingAmount",
      dataIndex: "pendingAmount",
    },
  ];

  return (
    <>
      <Box
        sx={{ mt: 3, mb: 2 }}
        display="flex"
        justifyContent="flex-end"
        marginRight="12px"
      >
        <Button color="primary" variant="contained" align="right">
          Generate PDF
        </Button>
      </Box>
      <Box sx={{ position: "relative", overflowX: "auto" }}>
        <Scrollbar>
          <Table
            sx={{ minWidth: 800, overflowX: "auto" }}
            columns={column}
            dataSource={dataWithKeys}
            title={() => (
              <Typography variant="h5">Sales Details of Year {year}</Typography>
            )}
            size="small"
            bordered
            rowClassName={() => "table-data-row"}
          ></Table>
        </Scrollbar>
      </Box>
    </>
  );
};

export default SalesAccounts;
