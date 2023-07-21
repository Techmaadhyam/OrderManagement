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
import {React, useContext} from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import EditIcon from '@mui/icons-material/Edit';
import {  Delete } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import ExcelJS from 'exceljs';
import IconWithPopup from '../user/user-icon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import imgUrl from '../pdfAssets/imageDataUrl';
// import techMaadhyam from '../pdfAssets/imageDataUrl2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../pdfAssets/vfs_fonts';
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';
import { LogoContext } from 'src/utils/logoContext';
import CircularProgress from "@mui/material/CircularProgress";




pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Helvetica: {
    normal: 'Helvetica.ttf',
    bold: 'Helvetica-Bold.ttf',
  }
};


const userId = sessionStorage.getItem('user') || localStorage.getItem('user');

const categoryBuySell = [
   
  {
    label: 'Purchase Quotation',
    value: 'Purchase Quotation'
  },
  {
    label: 'Sales Quotation',
    value: 'Sales Quotation'
  },
  {
    label: 'Service Quotation',
    value: 'Service Quotation'
  }
];

const QuotationViewTable = () => {
  const { logo } = useContext(LogoContext);
  const [userData, setUserData]= useState([])
  const [selectedCategory, setSelectedCategory] = useState('Purchase Quotation');
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);


  const navigate = useNavigate();
  
 
  useEffect(() => {
    axios.get(apiUrl +`getAllQuotations/${userId}`)
      .then(response => {
        setUserData(response.data);
        setLoading(false)
        // console.log(response.data)

      })
      .catch(error => {
        console.error(error);
          setLoading(false);
      });
  }, []);

  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const formattedArray = userData?.map((item) => {
    const formattedItem = { ...item }; 
  
    if (formattedItem.createdDate) {
      formattedItem.originalcreatedDate =formattedItem.createdDate
      formattedItem.createdDate = formatDate(formattedItem.createdDate);
    }
  
    if (formattedItem.lastModifiedDate) {
      formattedItem.lastModifiedDate = formatDate(formattedItem.lastModifiedDate);
    }
  
    if (formattedItem.deliveryDate) {
      formattedItem.originalDeliveryDate =formattedItem.deliveryDate
      formattedItem.deliveryDate = formatDate(formattedItem.deliveryDate);
    }
    if (formattedItem.startdate) {
      formattedItem.startdate = formatDate(formattedItem.startdate);
    }
    if (formattedItem.enddate) {
      formattedItem.enddate = formatDate(formattedItem.enddate);
    }
    return formattedItem;
  });

  const dataWithKeys = formattedArray?.map((item) => ({
    ...item,
    companyName: item.tempUser?.companyName || item.companyuser?.companyName, 
    key: item.id 
  }));

  const filteredData = selectedCategory
  ? dataWithKeys.filter((item) => item.category === selectedCategory)
  : dataWithKeys;

const handleCategoryChange = (event) => {
  setSelectedCategory(event.target.value);
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
 //delete row
  const handleRemoveRow = async () => {
     try {
       await axios.delete(apiUrl + `deleteQuotationId/${selectedProductId}`);
       const updatedRows = userData.filter((item) => item.id !== selectedProductId);
       setUserData(updatedRows);
       notify(
         "success",
         `Sucessfully deleted row with quotation order number: ${selectedProductId}.`
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
    if (record.category === 'Purchase Quotation') {
      navigate('/dashboard/quotation/edit', { state: record });
    } else if (record.category === 'Service Quotation') {
      navigate('/dashboard/quotation/editService', { state: record });
    } else if(record.category === 'Sales Quotation') {
      navigate('/dashboard/quotation/editSales', { state: record });
    }
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

  
const filteredList = filteredData.filter(product => {
  const companyMatch = product.companyName?.toLowerCase().includes(searchText.toLowerCase());
 
  return companyMatch
});



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
  

const handleQuotation = async (record) => {
  // console.log(record);
  try {
    const response = await axios.get(apiUrl +`getAllQuotationDetails/${record.id}`);
    

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.properties.defaultRowHeight = 15;
    worksheet.properties.defaultColWidth = 12;
    worksheet.properties.tabColor = { argb: 'FFFFFFFF' };
    worksheet.views = [{
      showGridLines: false
    }];

    
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'QUOTATION';
    titleCell.font = { size: 27, bold: true, name: 'Arial' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '87CEEB' }, // Sky blue color
    };
    worksheet.mergeCells('A1:K1');
    worksheet.mergeCells('A2:B6');
    const image = workbook.addImage({
      base64: `data:${logo.fileType};base64, ${logo.file}`,
      extension: logo.fileType.split('/')[1],
    });
    worksheet.addImage(image, {
      tl: { col: 0, row: 1.2},
      ext: { width: 167, height: 100 },
    });
    const infoData = [
      ['Quotation Date:', `${record.createdDate}`], 
      ['Quotation No.:', `${record.id}`], 
      ['Customer Name:', `${record.contactPersonName}`], 
      ['Customer Contact:', `${record.contactPhoneNumber}`], 
    ];
    
    infoData.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        const cell = worksheet.getCell(rowIndex + 3, colIndex + 3);
        cell.value = cellData;
        cell.font = { size: 10, bold: true, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });
    worksheet.mergeCells('A8:D8');
    const tableOneData = [
      ['Name:', `${record.createdByUser.companyName}`], 
      ['Address:', `${record.createdByUser.address} ${record.createdByUser.city} ${record.createdByUser.state}, ${record.createdByUser.pincode} ${record.createdByUser.country}`], 
      ['Contact:', `${record.createdByUser.mobile}`], 
      ['Email:', `${record.createdByUser.emailId}`], 
      ['GSTIN:', `${record.createdByUser.gstNumber}`], 
    ];
    tableOneData.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        const cell = worksheet.getCell(rowIndex + 10, colIndex + 1);
        cell.value = cellData;
        cell.font = { size: 10, bold: true, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });
    worksheet.getCell('A8').value = 'Company Details';
    worksheet.getCell('A8').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '87CEEB' }, // Sky blue color
    };
    worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A8').font = { size: 10, bold: true, name: 'Arial' };
    worksheet.getCell('G8').font = { size: 10, bold: true, name: 'Arial' };
    worksheet.getCell('G8').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A9:D9');
    worksheet.mergeCells('A15:D15');
    worksheet.mergeCells('B10:D10');
    worksheet.mergeCells('B11:D11');
    worksheet.mergeCells('B12:D12');
    worksheet.mergeCells('B13:D13');
    worksheet.mergeCells('B14:D14');
    
    worksheet.mergeCells('G8:J8');
    const tableTwoData = [
      ['Name:', `${record.contactPersonName}`], 
      ['Address:', `${record.deliveryAddress}, ${record.city}, ${record.state}, ${record.pinCode}, ${record.country}`],
      ['Contact:', `${record.contactPhoneNumber}`], 
      ['Email:', `${record.tempUser ? record.tempUser.emailId : record.companyuser.emailId}`], 
      ['GSTIN:', `${record.tempUser ? record.tempUser.gstNumber : record.companyuser.gstNumber}`], 
    ];
    tableTwoData.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        const cell = worksheet.getCell(rowIndex + 10, colIndex + 7);
        cell.value = cellData;
        cell.font = { size: 10, bold: true, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });
    worksheet.getCell('G8').value = 'Customer Details';
    worksheet.getCell('G8').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '87CEEB' }, // Sky blue color
    };
    worksheet.mergeCells('G9:J9');
    worksheet.mergeCells('G15:J15');
    worksheet.mergeCells('H10:J10');
    worksheet.mergeCells('H11:J11');
    worksheet.mergeCells('H12:J12');
    worksheet.mergeCells('H13:J13');
    worksheet.mergeCells('H14:J14');

    // Set Border for tables
    const tableBorder = { style: 'medium', color: { argb: '80808080' } };
    
    // Set border for cells E8 to E14 (left border)
    for (let row = 9; row <= 15; row++) {
      worksheet.getCell(`G${row}`).border = { left: tableBorder };
    }
    // Set border for cells G8 to G14 (right border)
    for (let row = 9; row <= 15; row++) {
      worksheet.getCell(`J${row}`).border = { right: tableBorder };
    }
    for (let row = 9; row <= 15; row++) {
      worksheet.getCell(`A${row}`).border = { left: tableBorder };
    }
    // Set border for cells G8 to G14 (right border)
    for (let row = 9; row <= 15; row++) {
      worksheet.getCell(`D${row}`).border = { right: tableBorder };
    }
    worksheet.getCell('A15').border = { bottom: tableBorder ,left: tableBorder, right: tableBorder};
    worksheet.getCell('A9').border = { left: tableBorder , right: tableBorder};
    worksheet.getCell('G15').border = { bottom: tableBorder ,left: tableBorder, right: tableBorder};
    worksheet.getCell('G9').border = { left: tableBorder , right: tableBorder};
    worksheet.getCell('G8').border = {
      top: tableBorder,
      left: tableBorder,
      bottom: tableBorder,
      right: tableBorder,
    };
    
    // Set border for cell A7 (top, bottom, left, right borders)
    worksheet.getCell('A8').border = {
      top: tableBorder,
      left: tableBorder,
      bottom: tableBorder,
      right: tableBorder,
    };
    worksheet.getRow(17).height = 45;
    worksheet.mergeCells('A17:K17');
    worksheet.getCell('A17').value = `Note/Remarks: ${record.comments}`;
    worksheet.getCell('A17').font = { size: 10, bold: true, name: 'Arial' };
    worksheet.getCell('A17').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('A17').border = {
      top: tableBorder,
      left: tableBorder,
      bottom: tableBorder,
      right: tableBorder,
    };
    let productTableHeaders = [];
    record.category === 'Service Quotation'? 
    productTableHeaders = [
      'S.No.',
      'PRODUCT DESCRIPTION',
      'WORKSTATIONS',
      'COST',
      'IGST',
    ]:productTableHeaders = [ 
      'S.No.',
      'PRODUCT DESCRIPTION',
      'HSN/SAC',
      'QUANTITY',
      'WEIGHT',
      'SIZE',
      'COST',
      'CGST',
      'SGST',
      'IGST',
      'AMOUNT',
    ];
    
    productTableHeaders.forEach((header, index) => {
      worksheet.getCell(19, index + 1).value = header;
      worksheet.getCell(19, index + 1).font = { bold: true, size: 9, name: 'Arial' };
      worksheet.getCell(19, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '87CEEB' },
      };
      if (index !==  0&& index !== 1) {
        worksheet.getColumn(index + 1).width = header.length + 8;
      }
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    });
    if (record.category === 'Service Quotation') {
      
      for (let row = 19; row <= 19; row++) {
        for (let col = 1; col <= 5; col++) {
          const cell = worksheet.getCell(row, col);
          cell.border = {
            top: tableBorder,
            // left: tableBorder,
            bottom: tableBorder,
            right: { style: 'thin', color: { argb: '80808080' } },
          };
        }
      }
    }else{

      for (let row = 19; row <= 19; row++) {
        for (let col = 1; col <= 11; col++) {
          const cell = worksheet.getCell(row, col);
          cell.border = {
            top: tableBorder,
            // left: tableBorder,
            bottom: tableBorder,
            right: { style: 'thin', color: { argb: '80808080' } },
          };
        }
      }
    }

    worksheet.getCell('A19').border = {
      top: tableBorder,
      left: tableBorder,
      bottom: tableBorder,
      right: { style: 'thin', color: { argb: '80808080' } },
    };
    
    const rowData = response.data.map((product, index) => {
      const totalAmount = (
        product.price * product.quantity +
        (product.price * product.quantity * product.cgst) / 100 +
        (product.price * product.quantity * product.sgst) / 100 +
        (product.price * product.quantity * product.igst) / 100
      ).toFixed(2);
      if (record.category === 'Service Quotation') {
        return{
          id: index + 1,
          productDescription: `${product.product.productName}(${product.product.partnumber})`,
          workstationCount: product.workstationCount,
          price: product.price,
          igst: product.igst,
        }
      }else{
        return {
          id: index + 1,
          productDescription: `${product.product.productName}(${product.product.partnumber})`,
          hsn: product.id,
          quantity: product.quantity,
          weight: product.weight,
          size: product.size,
          price: product.price,
          cgst: product.cgst,
          sgst: product.sgst,
          igst: product.igst,
          total: totalAmount,
        };
      }
    });
    rowData.forEach((row, rowIndex) => {
      Object.keys(row).forEach((key, columnIndex) => {
        const cell = worksheet.getCell(20 + rowIndex, columnIndex + 1);
        cell.value = row[key];
        cell.font = { bold: true, size: 9, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: tableBorder,
          left: tableBorder,
          bottom: tableBorder,
          right: tableBorder,
        };
      });
    });
    const editableRow = worksheet.lastRow.number + 4;
    const thankYouCell = worksheet.getCell(editableRow, 2);
    thankYouCell.value = 'THANK YOU FOR YOUR BUSINESS!';
    thankYouCell.font = { bold: true, size: 9, name: 'Arial' };
    thankYouCell.border = {
      top: tableBorder,
      left: tableBorder,
      right: tableBorder,
    };
    worksheet.mergeCells(`B${editableRow+1}:C${editableRow+1}`);
    const signatureCell = worksheet.getCell(editableRow + 1, 2);
    signatureCell.value = 'Signature/Stamp:';
    signatureCell.font = { size: 9, name: 'Arial' };
    signatureCell.border = {
      left: tableBorder,
      right: tableBorder,
    };

    const placeCell = worksheet.getCell(editableRow + 2, 2);
    placeCell.value = 'Place:';
    placeCell.font = { size: 9, name: 'Arial' };
    placeCell.border = {
      left: tableBorder,
    };
    const placeCell2 = worksheet.getCell(editableRow + 2, 3);
    placeCell2.value = `${record.createdByUser.state}`;
    placeCell2.font = { size: 9, name: 'Arial' };
    placeCell2.border = {
      right: tableBorder,
    };

    const DateCell = worksheet.getCell(editableRow + 3, 2);
    DateCell.value = `Date:`;
    DateCell.font = { size: 9, name: 'Arial' };
    DateCell.border = {
      left: tableBorder,
      bottom: tableBorder,
    };
    
    const DateCell2 = worksheet.getCell(editableRow + 3, 3);
    
    DateCell2.value = `${record.createdDate}`
    worksheet.mergeCells(`B${editableRow}:C${editableRow}`);
    DateCell2.font = { size: 9, name: 'Arial' };
    DateCell2.border = {      
      right: tableBorder,
      bottom: tableBorder,
    };
   
    // Save the workbook as a file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'table.xlsx';
      a.click();
    });
  } catch (error) {
    console.error(error);
  }
};
const handleQuotationPdf = async (record)=>{
  console.log(record);
  try{
    const response = await axios.get(apiUrl +`getAllQuotationDetails/${record.id}`)
      
      console.log(response.data)


const rowData = response.data.map((product, index) => {
  const totalAmount = (
    product.price * product.quantity +
    (product.price * product.quantity * product.cgst) / 100 +
    (product.price * product.quantity * product.sgst) / 100 +
    (product.price * product.quantity * product.igst) / 100
  ).toFixed(2);

  if (record.category === 'Service Quotation') {
    return[
      {text: index +1 , style: 'tableCell'},
      {text: `${product.product.productName}(${product.product.partnumber})`, style: 'tableCell'},
      {text: product.workstationCount, style: 'tableCell'},
      {text: product.igst, style: 'tableCell'},
      {text: product.price, style: 'tableCell'},
    ];
  }
  return [
    {text: index +1 , style: 'tableCell'},
    {text: `${product.product.productName}(${product.product.partnumber})`, style: 'tableCell'},
    {text: product.id, style: 'tableCell'},
    {text: product.quantity, style: 'tableCell'},
    {text: product.weight, style: 'tableCell'},
    {text: product.size, style: 'tableCell'},
    {text: product.price, style: 'tableCell'},
    {text: product.cgst, style: 'tableCell'},
    {text: product.sgst, style: 'tableCell'},
    {text: product.igst, style: 'tableCell'},
    {text: totalAmount, style: 'tableCell'},
  ];
});
      const docDefinition = {
          pageOrientation: 'landscape',
          defaultStyle: {
            font: 'Helvetica'},
          content: [
            {
              table: {
                widths: "*",
                body: [
                  [
                    {
                      columns: [
                        {
                          image:`data:${logo.fileType};base64, ${logo.file}`,
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
                              text: `GSTIN: ${record.createdByUser.gstNumber}`,
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
  
                        { text: "QUOTATION", style: "header", alignment: "right", margin: [0, 0, 20, 0] },
                      ],
                      border: [true, true, true, false],margin: [0, 10, 0, 0],
                    },
                  ],
                ],
              },
            },
            {
              style: 'newTable',
              
              table: {
                widths: ['*','auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: '', border: [true, false, false, false] },
                    { text: `Quotation Number`, style: 'font10', border: [true, true, true, false],alignment: "center"},
                    { text: `Quotation Date`, style: 'font10', border: [true, true, true, false],alignment: "center",},
                    { text: 'Customer ID', style: 'font10', border: [true, true, true, false],alignment: "center", },
                    { text: 'Customer Contact', style: 'font10', border: [true, true, true, false],alignment: "center", },
                    { text: 'Customer PO No.', style: 'font10', border: [true, true, true, false],alignment: "center", },
                  ],
                  [
                    { text: '', border: [true, false, false, false] },
                    { text: record.id, style: 'font10',border: [true, false, true, false],alignment: "center", },
                    { text: formatDate(record.createdDate), style: 'font10', border: [true, false, true, false],alignment: "center", },
                    { text: record.tempUser ? record.tempUser.id : record.companyuser.id, style: 'font10',border: [true, false, true, false],alignment: "center", },
                    { text: record.contactPhoneNumber, style: 'font10',border: [true, false, true, false],alignment: "center", },
                    { text: record.pinCode, style: 'font10',border: [true, false, true, false],alignment: "center", },
                  ],
                ],
              },
            },
            {
              style: 'infoTable',
              table: {
                widths: [166.5, 167, '*','*'],
                heights: ["auto", 80],
                body: [
                  [
                    { text: `Bill To: ${record.tempUser ? record.tempUser.companyName : record.companyuser.companyName}`, style: 'tableLabel', border: [true, true, true, false], marginBottom: 5 },
                    { text: `Ship To: ${record.contactPersonName}`, style: 'tableLabel', border: [true, true, true, false], marginBottom: 5 },
                    { text: 'Customer GST Registration information', style: 'font10', bold: true },
                    {
                      text: `Mode of Dispatch: ${record.modeofdelivery || 'N/A'}`,
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
                    text: `GST Registration Number: ${record.tempUser
                      ? record.tempUser.gstNumber
                      : record.companyuser.gstNumber}`,
                    border: [true, false, true, false],
                    style: "font10",
                  },
                  {
                    text: ``,
                    border: [true, false, true, false],
                    style: "font10",
                  },
                  ],
                ],
              },
            },
            {
              style: 'table',
              table: {
                  headerRows: 1,
              heights: [
                "auto",
                ...(rowData.length > 0
                  ? Array(rowData.length - 1)
                      .fill(0)
                      .concat([120 - (rowData.length - 1) * 20])
                  : [120]),
              ],
                  widths: record.category==='Service Quotation'?['auto', '*', 'auto', 'auto', 'auto']:['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  record.category === 'Service Quotation' ? [
                    { text: 'S.No.', style: 'tableLabel' },
                    { text: 'Product Description', style: 'tableLabel' },
                    { text: 'Workstation Count', style: 'tableLabel' },
                    { text: 'IGST', style: 'tableLabel' },
                    { text: 'Cost', style: 'tableLabel' },
                  ] : [
                    { text: 'S.No.', style: 'tableLabel' },
                    { text: 'Product Description', style: 'tableLabel' },
                    { text: 'HSN/SAC Code', style: 'tableLabel' },
                    { text: 'Qty', style: 'tableLabel' },
                    { text: 'Weight', style: 'tableLabel' },
                    { text: 'Size', style: 'tableLabel' },
                    { text: 'Cost', style: 'tableLabel' },
                    { text: 'CGST', style: 'tableLabel' },
                    { text: 'SGST', style: 'tableLabel' },
                    { text: 'IGST', style: 'tableLabel' },
                    { text: 'Amount', style: 'tableLabel' }
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
                widths: ["*", "auto","*"],
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
                      text: '',
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
                widths: ['*','*','*'],
                body: [
                  [
                        {
                          stack:[
                              { text: 'Terms & Conditions:',bold: true,margin:[0,0,0,3], style: 'font10'},
                              { text: `${record.termsAndCondition}`, style:'font10', fontSize:9}
                      
                      ],
                      border: [true, false, false, true],margin:[0,0,0,0], alignment:'left'
                  },
                      
                      {
                          stack:[
                              { text: `Received In Good Condition`,bold:true, fontSize: 12},
                              { text: `Customer Signature`, margin:[0,40,0,0], style: 'font10'},
                          ],
                          border: [false, false, false, true],margin:[0,0,0,0], alignment:'center'
                      },
                      {
                          stack:[
                              { text: `${record.createdByUser.companyName}`,bold:true,alignment:'center', fontSize: 12},
                              { text: `Authorize Signature`, margin:[0,40,0,0],alignment:'center', style: 'font10'},
                          ],
                          border: [false, false, true, true],margin:[0,0,0,0], alignment:'right'
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
    
        pdfMake.createPdf(docDefinition).download('quotation.pdf');
        // pdfMake.createPdf(docDefinition).open();
}
catch(error){
  console.error(error)
}
}
  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
      
          }}
        >
          Quotation Order Number
        </div>
      ),
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/quotation/viewDetail`, { state: record });
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
            <Typography variant="subtitle1">QO:{name}</Typography>
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
      title: "Created Date",
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
      title: "Download Quotation Spreadsheet",
      dataIndex: "quotation",
      key: "quotation",
      render: (_, record) => (
        <IconButton onClick={() => handleQuotation(record)}>
          <Icon>
            <DownloadIcon />
          </Icon>
        </IconButton>
      ),
    },
    {
      title: "Download Quotation PDF",
      dataIndex: "quotationPdf",
      key: "quotationPdf",
      render: (_, record) => (
        <IconButton onClick={() => handleQuotationPdf(record)}>
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

  const orderDateIndex = columns.findIndex(column => column.key === 'createdDate');
  const insertIndex = orderDateIndex + 1;
  const deliveryDateIndex = columns.findIndex(column => column.key === 'deliveryDate');

// Check if filteredList array has category === "service_quotation"
if (deliveryDateIndex !== -1 && filteredList.some(item => item.category === "Service Quotation")) {
  // Remove the "Delivery Date" column from the columns array
  columns.splice(deliveryDateIndex, 1);
}

  if (filteredList.some(item => item.category === "Service Quotation")) {
    columns.splice(insertIndex, 0, 
      {
        title: 'Assignment Start Date',
        key: 'startdate',
        dataIndex: 'startdate',
      },
      {
        title: 'Assignment End Date',
        key: 'enddate',
        dataIndex: 'enddate',
      }
    );
  }
   

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
          <h2 style={{ margin: 0 }}>View Quotation Order</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>

      <TextField
        label="Category"
        name="category"
        sx={{ minWidth: 250 }}
        value={selectedCategory}
        onChange={handleCategoryChange}
        select
        SelectProps={{
          MenuProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {categoryBuySell.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}>
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
            Are you sure you want to delete this quotation?
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
    
    export default  QuotationViewTable;

