import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { Table } from "antd";
import { Box } from "@mui/system";

import { apiUrl } from "src/config";


const PurchaseAccounts = ({ year }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userId =
      sessionStorage.getItem("user") || localStorage.getItem("user");

    axios
      .get(apiUrl + `getPurchaseOrderAccountingForMonthYear/${userId}/${year}`)
      .then((response) => {
        const groupedData = {};

        for (const { purchaseOrder, monthname } of response.data) {
          const month = monthname; // Extract the month name
          if (!groupedData[month]) {
            groupedData[month] = [];
          }
          groupedData[month].push(purchaseOrder); // Append the purchase order to the respective group
        }

        setUserData(groupedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [year]);

  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const renderTablesForMonths = () => {
    return Object.entries(userData).map(([month, data]) => {
      const dataWithKeys = data?.map((item) => ({
        ...item,
        companyName:
          item?.tempUser?.companyName || item?.companyuser?.companyName,
        gstn: item?.tempUser?.gstNumber || item?.companyuser?.gstNumber,
        pendingAmount: item?.totalAmount - item?.paidamount,
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
        <Box key={month} sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "12px",
              marginBottom: 1,
            }}
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
                  <Typography variant="h5">
                    Purchase Details of {month} {year}
                  </Typography>
                )}
                size="small"
                bordered
                rowClassName={() => "table-data-row"}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        Total Taxable:{" "}
                        {dataWithKeys
                          ?.reduce((total, item) => total + item.totalcost, 0)
                          .toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        Total IGST:{" "}
                        {dataWithKeys
                          ?.reduce((total, item) => total + item.totaligst, 0)
                          .toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        Total CGST:{" "}
                        {dataWithKeys
                          ?.reduce((total, item) => total + item.totalcgst, 0)
                          .toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        Total SGST:{" "}
                        {dataWithKeys
                          ?.reduce((total, item) => total + item.totalsgst, 0)
                          .toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        Total Amount:{" "}
                        {dataWithKeys
                          ?.reduce((total, item) => total + item.totalAmount, 0)
                          .toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        {" "}
                        Total Pending:{" "}
                        {dataWithKeys
                          ?.reduce(
                            (total, item) => total + item.pendingAmount,
                            0
                          )
                          .toFixed(2)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Scrollbar>
          </Box>
        </Box>
      );
    });
  };

  return <>{renderTablesForMonths()}</>;
};

export default PurchaseAccounts;
