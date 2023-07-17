import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Typography, Button } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { Table } from "antd";
import { Box } from "@mui/system";
import { apiUrl } from "src/config";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../pdfAssets/vfs_fonts";
import { LogoContext } from 'src/utils/logoContext'
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Helvetica: {
    normal: 'Helvetica.ttf',
    bold: 'Helvetica-Bold.ttf',
  }
};

const SalesAccounts = ({ year }) => {
  const { logo } = useContext(LogoContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userId =
      sessionStorage.getItem("user") || localStorage.getItem("user");

    axios
      .get(apiUrl + `getSalesOrderAccountingForMonthYear/${userId}/${year}`)
      .then((response) => {
        const groupedData = {};

        for (const { salesOrder, monthname } of response.data) {
          const month = monthname; // Extract the month name
          if (!groupedData[month]) {
            groupedData[month] = [];
          }
          groupedData[month].push(salesOrder); // Append the order to the respective group
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
      const handlePDF = () => {
        try {
          console.log(dataWithKeys)
          const rowData = dataWithKeys.map((item, index) => {
            return [
              { text: index + 1, style: "tableContent" },
              { text: formatDate(item.createdDate), style: "tableContent" },
              { text: item.id, style: "tableContent" },
              { text: item.companyName, style: "tableContent" },
              { text: item.gstn, style: "tableContent" },
              { text: item.totalcost, style: "tableContent" },
              { text: item.totaligst, style: "tableContent" },
              { text: item.totalcgst, style: "tableContent" },
              { text: item.totalsgst, style: "tableContent" },
              { text: item.totalAmount, style: "tableContent" },
              { text: item.totalAmount - item.paidamount, style: "tableContent" },
            ]
          });
          const docDefinition = {
            pageOrientation: "landscape",
            defaultStyle: {
              font: "Helvetica",
            },
            content: [
              {
                table: {
                  widths: "*",
                  body: [
                    [
                      {
                        columns: [
                          {
                            image: `data:${logo.fileType};base64, ${logo.file}`,
                            // image: pdfLogo,
                            width: 100,
                            alignment: "left",
                          },
                          {
                            text: `AMC Details of ${month} ${year}`,
                            style: "header",
                            alignment: "center",
                          },

                        ],
                        border: [true, true, true, false],
                        margin: [0, 10, 0, 20],
                      },
                    ],
                  ],
                },
              },
              {
                style: "table",
                table: {
                  widths: [
                    "auto",
                    "auto",
                    "auto",
                    "*",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                  ],
                  headerRows: 1,
                  // heights: [
                  //   "auto",
                  //   ...(rowData.length > 0
                  //     ? Array(rowData.length - 1)
                  //       .fill(0)
                  //       .concat([100 - (rowData.length - 1) * 20])
                  //     : [120]),
                  // ],
                  body: [
                    [
                      { text: "S.No.", style: "tableLabel" },
                      { text: "Order Date", style: "tableLabel" },
                      { text: "Invoice No.", style: "tableLabel" },
                      { text: "Customer Name", style: "tableLabel" },
                      { text: "GSTIN", style: "tableLabel" },
                      { text: "Taxable Supply", style: "tableLabel" },
                      { text: "Total IGST", style: "tableLabel" },
                      { text: "Total CGST", style: "tableLabel" },
                      { text: "Total SGST", style: "tableLabel" },
                      { text: "Total Amount", style: "tableLabel" },
                      { text: "Pending Amount", style: "tableLabel" },
                    ],
                    ...rowData,
                    [
                      { text: "Total", style: "tableLabel" },
                      { text: "", style: "tableLabel" },
                      { text: "", style: "tableLabel" },
                      { text: "", style: "tableLabel" },
                      { text: "", style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.totalcost, 0).toFixed(2), style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.totaligst, 0).toFixed(2), style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.totalcgst, 0).toFixed(2), style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.totalsgst, 0).toFixed(2), style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.totalAmount, 0).toFixed(2), style: "tableLabel" },
                      { text: dataWithKeys?.reduce((total, item) => total + item.pendingAmount, 0).toFixed(2), style: "tableLabel" },
                    ]
                  ],
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return i === 0 || i === node.table.body.length ? 1 : 1;
                  },
                  vLineWidth: function (i, node) {
                    return i === 0 || i === node.table.widths.length ? 1 : 1;
                  },
                  hLineColor: function (i, node) {
                    return i === 0 || i === node.table.body.length
                      ? "black"
                      : "gray";
                  },
                  vLineColor: function (i, node) {
                    return i === 0 || i === node.table.widths.length
                      ? "black"
                      : "gray";
                  },
                  paddingTop: function () {
                    return 5;
                  },
                  paddingBottom: function () {
                    return 5;
                  },
                },
              },
            ],
            styles: {
              header: {
                fontSize: 15,
                bold: true,
                margin: [0, 0, 0, 5],
              },
              subheader: {
                fontSize: 12,
                marginBottom: 5,
              },
              tableLabel: {
                bold: true,
                fontSize: 10,
                // border: [false, false, false, true],
              },
              tableContent: {
                fontSize: 10,
              },
              font10: {
                fontSize: 10,
              },
              tableCell: {
                fontSize: 8,
              },
              tableHeader: {
                fillColor: "#eeeeee",
                bold: true,
              },
            },
          }
          pdfMake.createPdf(docDefinition).open();

        } catch (error) {
          console.error(error)
        }
      }
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
            <Button color="primary" variant="contained" align="right" onClick={() => handlePDF()}>
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
                    Sales Details of {month} {year}
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

export default SalesAccounts;
