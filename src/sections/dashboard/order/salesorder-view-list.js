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
import "./sales-order.css";
import { Box } from "@mui/system";
import {React, useContext} from "react";
import { Scrollbar } from "src/components/scrollbar";
import DownloadIcon from "@mui/icons-material/Download";
import IconWithPopup from "../user/user-icon";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import { apiUrl } from "src/config";
import CircularProgress from "@mui/material/CircularProgress";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import imgUrl from "../pdfAssets/imageDataUrl.js";
// import techMaadhyam from "../pdfAssets/imageDataUrl2";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../pdfAssets/vfs_fonts";
import Logo from "../logo/logo";
import {LogoContext} from 'src/utils/logoContext'


const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Helvetica: {
    normal: 'Helvetica.ttf',
    bold: 'Helvetica-Bold.ttf',
  }
};
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

const SalesOrderViewList = () => {
  const { logo } = useContext(LogoContext);
  const [userData, setUserData] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(apiUrl + `getAllSalesOrderDetailByUser/${userId}`)
      .then((response) => {
        setUserData(response.data);
        // console.log(response.data);
        setLoading(false)
      })
      .catch((error) => {
        console.error(error);
          setLoading(false);
      });
  }, []);
  const numberToWords = require("number-to-words");
  const convertAmountToWords = (amount) => {
    const rupees = Math.floor(amount);
    const paisa = Math.round((amount - rupees) * 100);
    const rupeesInWords = numberToWords.toWords(rupees); // Convert rupees to words
    const paisaInWords = numberToWords.toWords(paisa); // Convert paisa to words
    let result = "";
    if (rupees > 0) {
      result += `${rupeesInWords} rupees`;
    }
    if (paisa > 0) {
      if (rupees > 0) {
        result += " and ";
      }
      result += `${paisaInWords} paisa`;
    }
    // Capitalize first letter of each word in the result string
    result = result.replace(/\b\w/g, (match) => match.toUpperCase());

    return result;
  };

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
      await axios.delete(apiUrl + `deleteSalesOrderId/${selectedProductId}`);
      const updatedRows = userData.filter((item) => item.id !== selectedProductId);
      setUserData(updatedRows);
      notify(
        "success",
        `Sucessfully deleted row with sales order number: ${selectedProductId}.`
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
    navigate("/dashboard/orders/edit", { state: record });
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

  const filteredList = dataWithKeys.filter((product) => {
    const companyMatch = product.companyName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return companyMatch || !product.hasOwnProperty("companyName");
  });

  const filteredData = selectedType
    ? filteredList.filter((item) => item.type === selectedType)
    : filteredList;

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleInvoicePdf = async (record, heading, dateData, noData) => {
    console.log(record);
    try {
      const response = await axios.get(
        apiUrl + `getAllSalesOrderDetails/${record.id}`
      );
      console.log(response.data);

      const rowData = response.data.map((product, index) => {
        // let invent = JSON.parse(product.inventory);
        let TotalBD = product.price * product.quantity;
        let discount = (TotalBD * product.discountpercent) / 100;
        let TotalAD = TotalBD - discount;
        let TotalGST = product.sgst + product.cgst + product.igst;
        let TotalGSTAmount = (TotalAD * TotalGST) / 100;
        return [
          { text: index + 1, style: "tableCell" },
          {
            text: `${product.inventory.product.productName}(${product.inventory.product.partnumber})`,
            style: "tableCell",
          },
          { text: product.inventory.hsncode, style: "tableCell" },
          { text: product.price, style: "tableCell" },
          { text: product.quantity, style: "tableCell" },
          { text: TotalBD, style: "tableCell" },
          { text: discount, style: "tableCell" },
          { text: TotalAD, style: "tableCell" },
          { text: product.sgst, style: "tableCell" },
          { text: product.cgst, style: "tableCell" },
          { text: product.igst, style: "tableCell" },
          { text: TotalAD + TotalGSTAmount, style: "tableCell" },
        ];
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
                        stack: [
                          {
                            text: `${record.createdByUser.companyName}`,
                            style: "header",
                          },
                          {
                            text: `${record.createdByUser.address}, ${record.createdByUser.city}, ${record.createdByUser.pincode}, ${record.createdByUser.state}, ${record.createdByUser.country}`,
                            style: "subheader",
                          },
                          {
                            text: `GSTN NO: ${record.createdByUser.gstNumber}`,
                            style: "subheader",
                          },
                        ],
                        margin: [20, 0, 0, 0],
                      },

                      {
                        text: "ORIGINAL",
                        style: "header",
                        alignment: "center",
                      },

                      {
                        text: heading,
                        style: "header",
                        alignment: "right",
                        margin: [0, 0, 20, 0],
                      },
                    ],
                    border: [true, true, true, false],
                    margin: [0, 10, 0, 0],
                  },
                ],
              ],
            },
          },
          {
            style: "newTable",

            table: {
              widths: ["*", "auto", "auto", "auto", "auto", "auto"],
              body: [
                [
                  { text: "", border: [true, false, false, false] },
                  {
                    text: `${noData} Number`,
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: `${dateData}`,
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Customer ID",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Customer Contact",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Customer PO No.",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                ],
                [
                  {
                    text: "",
                    border: [true, false, false, false],
                    style: "font10",
                  },
                  {
                    text: record.id,
                    border: [true, false, true, false],
                    style: "font10",
                    alignment: "center",
                  },
                  {
                    text: formatDate(record.createdDate),
                    border: [true, false, true, false],
                    style: "font10",
                    alignment: "center",
                  },
                  {
                    text: record.tempUser
                      ? record.tempUser.id
                      : record.companyuser.id,
                    border: [true, false, true, false],
                    style: "font10",
                    alignment: "center",
                  },
                  {
                    text: record.contactPhone,
                    border: [true, false, true, false],
                    style: "font10",
                    alignment: "center",
                  },
                  {
                    text: record.pinCode,
                    border: [true, false, true, false],
                    style: "font10",
                    alignment: "center",
                  },
                ],
              ],
            },
          },
          {
            style: "infoTable",
            table: {
              widths: [178, 178.5, 200, "*"],
              heights: ["auto", 80],
              body: [
                [
                  {
                    text: `Bill To: ${
                      record.tempUser
                        ? record.tempUser.companyName
                        : record.companyuser.companyName
                    }`,
                    style: "tableLabel",
                    border: [true, true, true, false],
                    marginBottom: 5,
                  },
                  {
                    text: `Ship To: ${record.contactPerson}`,
                    style: "tableLabel",
                    border: [true, true, true, false],
                    marginBottom: 5,
                  },
                  {
                    text: "Customer GST Registration information",
                    style: "font10",
                    bold: true,
                  },
                  {
                    text: `Mode of Dispatch: ${record.modeofdelivery}`,
                    style: "font10",
                    border: [true, true, true, true],
                  },
                ],
                [
                  record.tempUser
                    ? {
                        stack: [
                          {
                            text: record.tempUser.address,
                            style: "font10",
                            marginBottom: 5,
                          },
                          {
                            text: `${record.tempUser.city} - ${record.tempUser.pincode}`,
                            style: "font10",
                            marginBottom: 5,
                          },
                          { text: record.tempUser.state, style: "font10" },
                          { text: record.tempUser.country, style: "font10" },
                        ],
                        border: [true, false, true, false],
                      }
                    : {
                        stack: [
                          {
                            text: record.companyuser.address,
                            style: "font10",
                            marginBottom: 5,
                          },
                          {
                            text: `${record.companyuser.city} - ${record.companyuser.pincode}`,
                            style: "font10",
                            marginBottom: 5,
                          },
                          { text: record.companyuser.state, style: "font10" },
                          { text: record.companyuser.country, style: "font10" },
                        ],
                        border: [true, false, true, false],
                      },
                  {
                    stack: [
                      {
                        text: record.deliveryAddress,
                        style: "font10",
                        marginBottom: 5,
                      },
                      {
                        text: `${record.city} - ${record.pinCode}`,
                        style: "font10",
                        marginBottom: 5,
                      },
                      { text: record.state, style: "font10" },
                      { text: record.country, style: "font10" },
                    ],
                    border: [true, false, true, false],
                  },
                  {
                    text: `GST Registration Number: ${
                      record.tempUser
                        ? record.tempUser.gstNumber
                        : record.companyuser.gstNumber
                    }`,
                    border: [true, false, true, false],
                    style: "font10",
                  },
                  {
                    text: `Mode of Payment: ${record.paymentMode}`,
                    border: [true, false, true, false],
                    style: "font10",
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
                "*",
                "auto",
                "auto",
                "auto",
                60,
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
              ],
              headerRows: 1,
              heights: [
                "auto",
                ...(rowData.length > 0
                  ? Array(rowData.length - 1)
                      .fill(0)
                      .concat([100 - (rowData.length - 1) * 20])
                  : [120]),
              ],
              body: [
                [
                  { text: "S.No.", style: "tableLabel" },
                  { text: "Part No./Product Description", style: "tableLabel" },
                  { text: "HSN/SAC Code", style: "tableLabel" },
                  { text: "Unit Price", style: "tableLabel" },
                  { text: "Qty", style: "tableLabel" },
                  { text: "Total before Discount", style: "tableLabel" },
                  { text: "Discount", style: "tableLabel" },
                  { text: "Total", style: "tableLabel" },
                  { text: "SGST", style: "tableLabel" },
                  { text: "CGST", style: "tableLabel" },
                  { text: "IGST", style: "tableLabel" },
                  { text: "Line Total", style: "tableLabel" },
                ],
                ...rowData,
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
          {
            table: {
              heights: [50],
              widths: ["*", "auto", "*"],
              body: [
                [
                  {
                    text: "REMARKS",
                    alignment: "left",
                    bold: true,
                    style: "font10",
                    border: [true, false, false, true],
                  },
                  {
                    text: "",
                    border: [false, false, false, true],
                  },
                  {
                    stack: [
                      {
                        text: `TOTAL: \u20B9 ${record.totalAmount}`,
                        alignment: "left",
                        bold: true,
                        style: "font10",
                      },
                      {
                        text: `Amount in Words: \u20B9 ${convertAmountToWords(
                          record.totalAmount
                        )}`,
                        alignment: "left",
                        bold: true,
                        style: "font10",
                      },
                    ],
                    border: [false, false, true, true],
                    margin: [0, 0, 10, 0],
                    alignment: "right",
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    stack: [
                      {
                        text: "Terms & Conditions",
                        bold: true,
                        style: "font10",
                      },
                      { text: `${record.termsAndCondition}`, style: "font10" },
                    ],
                    border: [true, false, false, true],
                    margin: [0, 0, 0, 0],
                    alignment: "left",
                  },

                  {
                    stack: [
                      {
                        text: `Received In Good Condition`,
                        bold: true,
                        fontSize: 12,
                      },
                      {
                        text: `Customer Signature`,
                        margin: [0, 40, 0, 0],
                        style: "font10",
                      },
                    ],
                    border: [false, false, false, true],
                    margin: [0, 0, 0, 0],
                    alignment: "center",
                  },
                  {
                    stack: [
                      {
                        text: `For ${record.createdByUser.companyName}`,
                        bold: true,
                        alignment: "center",
                        fontSize: 12,
                      },
                      {
                        text: `Authorize Signature`,
                        margin: [0, 40, 0, 0],
                        alignment: "center",
                        style: "font10",
                      },
                    ],
                    border: [false, false, true, true],
                    margin: [0, 0, 0, 0],
                    alignment: "right",
                  },
                ],
              ],
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
      };

      pdfMake.createPdf(docDefinition).download("invoice.pdf");
      // pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error(error);
    }
  };
  const handleChallanPdf = async (record) => {
    // console.log(record);
    try {
      const response = await axios.get(
        apiUrl + `getAllSalesOrderDetails/${record.id}`
      );
      // console.log(response.data);
      const rowData = response.data.map((product, index) => {
        return [
          { text: index + 1, style: "tableCell" },
          {
            text: `${product.inventory.product.productName}(${product.inventory.product.partnumber})`,
            style: "tableCell",
          },
          { text: "", style: "tableCell" },
          { text: product.quantity, style: "tableCell" },
        ];
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
                        // image: imgUrl,
                        width: 100,
                        alignment: "left",
                      },
                      {
                        stack: [
                          {
                            text: `${record.createdByUser.companyName}`,
                            style: "header",
                          },
                          {
                            text: `${record.createdByUser.address}, ${record.createdByUser.city}, ${record.createdByUser.pincode}, ${record.createdByUser.state}, ${record.createdByUser.country}`,
                            style: "subheader",
                          },
                          {
                            text: `GSTN NO: ${record.createdByUser.gstNumber}`,
                            style: "subheader",
                          },
                        ],
                        margin: [20, 0, 0, 0],
                      },

                      {
                        text: "ORIGINAL",
                        style: "header",
                        alignment: "center",
                      },

                      {
                        text: "DELIVERY CHALLAN",
                        style: "header",
                        alignment: "right",
                        margin: [0, 0, 10, 0],
                      },
                    ],
                    border: [true, true, true, false],
                    margin: [0, 10, 0, 0],
                  },
                ],
              ],
            },
          },
          {
            style: "newTable",
            table: {
              widths: ["*", "auto", "auto", "auto", "auto"],
              body: [
                [
                  {
                    text: "",
                    border: [true, false, false, false],
                  },
                  {
                    text: "Delivery Challan No.",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Date",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Customer ID",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                  {
                    text: "Customer Contact",
                    style: "font10",
                    border: [true, true, true, false],
                    alignment: "center",
                  },
                ],
                [
                  { text: "", border: [true, false, false, false] },
                  {
                    text: record.id,
                    style: "font10",
                    border: [true, false, true, false],
                    alignment: "center",
                  },
                  {
                    text: formatDate(record.createdDate),
                    style: "font10",
                    border: [true, false, true, false],
                    alignment: "center",
                  },
                  {
                    text: record.tempUser
                      ? record.tempUser.id
                      : record.companyuser.id,
                    style: "font10",
                    border: [true, false, true, false],
                    alignment: "center",
                  },
                  {
                    text: record.contactPhone,
                    style: "font10",
                    border: [true, false, true, false],
                    alignment: "center",
                  },
                ],
              ],
            },
          },
          {
            style: "infoTable",
            table: {
              widths: [215, 214, "*"],
              heights: ["auto", 80],
              body: [
                [
                  {
                    text: `Bill To: ${
                      record.tempUser
                        ? record.tempUser.companyName
                        : record.companyuser.companyName
                    }`,
                    style: "tableLabel",
                    border: [true, true, true, false],
                    marginBottom: 5,
                  },
                  {
                    text: `Ship To: ${record.contactPerson}`,
                    style: "tableLabel",
                    border: [true, true, true, false],
                    marginBottom: 5,
                  },
                  {
                    text: "Customer GST Registration information",
                    style: "font10",
                    bold: true,
                  },
                ],
                [
                  record.tempUser
                    ? {
                        stack: [
                          {
                            text: record.tempUser.address,
                            style: "font10",
                            marginBottom: 5,
                          },
                          {
                            text: `${record.tempUser.city} - ${record.tempUser.pincode}`,
                            style: "font10",
                            marginBottom: 5,
                          },
                          { text: record.tempUser.state, style: "font10" },
                          { text: record.tempUser.country, style: "font10" },
                        ],
                        border: [true, false, true, false],
                      }
                    : {
                        stack: [
                          {
                            text: record.companyuser.address,
                            style: "font10",
                            marginBottom: 5,
                          },
                          {
                            text: `${record.companyuser.city} - ${record.companyuser.pincode}`,
                            style: "font10",
                            marginBottom: 5,
                          },
                          { text: record.companyuser.state, style: "font10" },
                          { text: record.companyuser.country, style: "font10" },
                        ],
                        border: [true, false, true, false],
                      },
                  {
                    stack: [
                      {
                        text: record.deliveryAddress,
                        style: "font10",
                        marginBottom: 5,
                      },
                      {
                        text: `${record.city} - ${record.pinCode}`,
                        style: "font10",
                        marginBottom: 5,
                      },
                      { text: record.state, style: "font10" },
                      { text: record.country, style: "font10" },
                    ],
                    border: [true, false, true, false],
                  },
                  {
                    text: `GST Registration Number: ${
                      record.tempUser
                        ? record.tempUser.gstNumber
                        : record.companyuser.gstNumber
                    }`,
                    border: [true, false, true, false],
                    style: "font10",
                  },
                ],
              ],
            },
          },
          {
            style: "table",
            table: {
              heights: [
                "auto",
                ...(rowData.length > 0
                  ? Array(rowData.length - 1)
                      .fill(0)
                      .concat([120 - (rowData.length - 1) * 20])
                  : [120]),
              ],
              widths: ["auto", "*", 40, "auto"],
              body: [
                [
                  { text: "S.No.", style: "tableLabel" },
                  {
                    text: "Item Code/product Description",
                    style: "tableLabel",
                  },
                  { text: "", style: "tableLabel" },
                  { text: "Quantity", style: "tableLabel" },
                ],
                ...rowData,
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
          {
            table: {
              heights: [50],
              widths: ["*"],
              body: [
                [
                  {
                    text: "NOTE:  Standby Returnable Basis, Kindly share the WO",
                    alignment: "left",
                    style: "font10",
                    bold: true,
                    border: [true, false, true, true],
                  },
                ],
              ],
            },
          },
          {
            table: {
              // heights:[100],
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    stack: [
                      {
                        text: "Terms & Conditions",
                        bold: true,
                        style: "font10",
                      },
                      { text: `${record.termsAndCondition}`, style: "font10" },
                    ],
                    border: [true, false, false, true],
                    alignment: "left",
                  },
                  {
                    stack: [
                      {
                        text: `Received In Good Condition`,
                        bold: true,
                        fontSize: 12,
                        alignment: "center",
                      },
                      {
                        text: `Customer Signature`,
                        margin: [0, 40, 0, 0],
                        style: "font10",
                      },
                    ],
                    border: [false, false, false, true],
                    alignment: "center",
                  },
                  {
                    stack: [
                      {
                        text: `For ${record.createdByUser.companyName}`,
                        bold: true,
                        fontSize: 12,
                        alignment: "center",
                      },
                      {
                        text: `Authorize Signature`,
                        margin: [0, 40, 0, 0],
                        style: "font10",
                        alignment: "center",
                      },
                    ],
                    border: [false, false, true, true],
                    alignment: "right",
                  },
                ],
              ],
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
      };

      pdfMake.createPdf(docDefinition).download("deliveryChallan.pdf");
      // pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error(error);
    }
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
          Sales Order Number
        </div>
      ),
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/orders/viewDetail/${record.id}`, {
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
            <Typography variant="subtitle1">SP:{name}</Typography>
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
        <IconButton onClick={() => handleNavigation(record)}>
          <Icon>
            <EditIcon />
          </Icon>
        </IconButton>
      ),
    },

    {
      title: "Download Invoice",
      dataIndex: "downloadInvoice",
      key: "downloadInvoice",
      render: (_, record) => {
        if (record.status === "Approved") {
          return (
            <IconButton
              onClick={() =>
                handleInvoicePdf(
                  record,
                  "TAX INVOICE",
                  "Invoice Date",
                  "Invoice"
                )
              }
            >
              <Icon>
                <DownloadIcon />
              </Icon>
            </IconButton>
          );
        }
        return null; // Return null if the condition is not met
      },
    },
    {
      title: "Download Delivery Challan",
      dataIndex: "deliveryChallan",
      key: "deliveryChallan",
      render: (_, record) => {
        if (record.status === "Approved") {
          return (
            <IconButton onClick={() => handleChallanPdf(record)}>
              <Icon>
                <DownloadIcon />
              </Icon>
            </IconButton>
          );
        }
        return null; // Return null if the condition is not met
      },
    },
    {
      title: "Proforma Invoice",
      dataIndex: "downloadPI",
      key: "downloadPI",
      render: (_, record) => (
        <IconButton
          onClick={() =>
            handleInvoicePdf(record, "PROFORMA INVOICE", "Date", "Quotation")
          }
        >
          <Icon>
            <DownloadIcon />
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
          <h2 style={{ margin: 0 }}>Sales Order Invoice</h2>
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
            Are you sure you want to delete this sales order?
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

export default SalesOrderViewList;
