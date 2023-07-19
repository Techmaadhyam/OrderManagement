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
import { Box, border } from '@mui/system';
import {React, useContext} from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import EditIcon from '@mui/icons-material/Edit';
import {  Delete } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import IconWithPopup from '../user/user-icon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';
// import imgUrl from '../pdfAssets/imageDataUrl';
import pdfFonts from '../pdfAssets/vfs_fonts';
import { LogoContext } from 'src/utils/logoContext';
import CircularProgress from "@mui/material/CircularProgress";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Helvetica: {
    normal: "Helvetica.ttf",
    bold: "Helvetica-Bold.ttf",
  },
};
const userId = sessionStorage.getItem('user') || localStorage.getItem('user');


const AmcViewTable = () => {
  const {logo} = useContext(LogoContext)
  const [userData, setUserData]= useState([])
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
      const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
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
          setLoading(false);
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
      formattedItem.originalstartdate =formattedItem.startdate
      formattedItem.startdate = formatDate(formattedItem.startdate);
    }
    if (formattedItem.enddate) {
      formattedItem.originalenddate =formattedItem.enddate
      formattedItem.enddate = formatDate(formattedItem.enddate);
    }
  
  
    return formattedItem;
  });

  const dataWithKeys = formattedArray
  ?.filter(item => item.category === "amc")
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
        await axios.delete(apiUrl + `deleteWorkOrderById/${selectedProductId}`);
        const updatedRows = userData.filter((item) => item.id !== selectedProductId);
        setUserData(updatedRows);
        notify(
          "success",
          `Sucessfully deleted row with AMC number: ${selectedProductId}.`
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

    navigate('/dashboard/services/amcedit', { state: record });
 
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
const numberToWords = require('number-to-words');
const convertAmountToWords = (amount) => {
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);

  const rupeesInWords = numberToWords.toWords(rupees); // Convert rupees to words
  const paisaInWords = numberToWords.toWords(paisa); // Convert paisa to words

  let result = '';

  if (rupees > 0) {
    result += `${rupeesInWords} rupees`;
  }

  if (paisa > 0) {
    if (rupees > 0) {
      result += ' and ';
    }
    result += `${paisaInWords} paisa`;
  }

  return result;
};
console.log(filteredList);

const handleWorkInvoice = async (record) => {
  console.log(record);
  try{
        const response = await axios.get(apiUrl +`getAllWorkOrderItems/${record.id}`)
          console.log(response.data)
          const rowData = response.data.map((item,index) => {
            let subTotal = item.unitPrice * item.workstationcount;
            let igst = item.igst;
            let igstAmount = (subTotal * igst) / 100;
            let total = (subTotal + igstAmount).toFixed(2);
            return [index+1, item.product.productName, item.unitPrice,`${item.workstationcount} WORK STATIONS`,subTotal,item.igst,total];
          })
          const totalAmount = response.data.map((item)=>{
            let subTotal = item.unitPrice * item.workstationcount;
            let igst = item.igst;
            let igstAmount = (subTotal * igst) / 100;
            let total = subTotal + igstAmount;
            return total.toFixed(2);
          }) 
          const docDefinition = {
            pageOrientation: "landscape",
            defaultStyle: {
              font: "Helvetica",
            },
            content: [
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
                      {
                        text: `PAN: ${record.createdByUser.pancard}`,
                        style: "subheader",
                      },
                    ],
                    margin: [20, 0, 0, 0],
                  },
                  {
                    text: "ANNUAL MAINTENANCE CONTRACT",
                    style: "header",
                    alignment: "right",
                  },
                ],
                margin: [0, 0, 0, 20],
              },
              {
                columns: [
                  {
                    stack: [
                      { text: "Customer Name", style: "workDetails" },
                      { text: "Customer Address", style: "workDetails" },
                    ],
                    alignment: "left",
                  },
                  {
                    stack: [
                      {
                        text: `${
                          record.noncompany?.companyName ||
                          record.company?.companyName
                        }`,
                        style: "workDetails",
                      },
                      {
                        stack: [
                          {
                            text: `${
                              record.noncompany?.address ||
                              record.company?.address
                            }, ${
                              record.noncompany?.city || record.company?.city
                            }`,
                            style: "workDetails",
                          },
                          {
                            text: `${
                              record.noncompany?.state || record.company?.state
                            }, ${
                              record.noncompany?.pincode ||
                              record.company?.pincode
                            }`,
                            style: "workDetails",
                          },
                          {
                            text: `${
                              record.noncompany?.country ||
                              record.company?.country
                            }`,
                            style: "workDetails",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    stack: [
                      { text: "Engineer Name", style: "workDetails" },
                      { text: "Contact No.", style: "workDetails" },
                      { text: "Email", style: "workDetails" },
                    ],
                    alignment: "right",
                    margin: [40, 0, 0, 0],
                  },
                  {
                    stack: [
                      {
                        text: `${record.technicianInfo.userName}`,
                        style: "workDetails",
                      },
                      {
                        text: `${record.technicianInfo.mobile}`,
                        style: "workDetails",
                      },
                      {
                        text: `${record.technicianInfo.emailId} `,
                        style: "workDetails",
                      },
                    ],
                    alignment: "right",
                  },
                ],
                margin: [0, 0, 0, 20],
              },
              {
                columns: [
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "Admin Incharge",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `Mr. ${record.adminPersonName}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: "Equipment Incharge",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `Mr. ${record.contactPersonName}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "Email",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.adminEmail}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: "Email",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.contactEmail}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "Contact No",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.adminPhoneNumber}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: "Contact No",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.contactPhoneNumber}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                ],
                margin: [0, 0, 0, 20],
              },
              {
                columns: [
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "STATUS",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.status}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: "Date of stating",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `  ${record.startdate}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "OLD",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                  {
                    table: {
                      body: [
                        [
                          {
                            text: "Existing Date of Expiry",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: ``,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: "Date of Expiry",
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                          {
                            text: `${record.enddate}`,
                            style: "workDetails",
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                  },
                ],
                margin: [0, 0, 0, 20],
              },
              {
                table: {
                  widths: [30, "*", "*", "*", "*", 50, 100],
                  body: [
                    [
                      "S.No.",
                      "MODEL",
                      "Unit Price",
                      "NO OF WORKSTATIONS",
                      "SUB T0TAL",
                      "IGST",
                      "TOTAL",
                    ],
                    ...rowData,
                  ],
                },
              },
              {
                stack: [
                  {
                    // text: `Total INR: ${record.totalAmount}`,
                    text: `Total INR: ${record.paidamount}`,
                    style: "workDetails",
                    bold: true,
                  },
                  {
                    text: `Total in words: ${convertAmountToWords(
                      // record.totalAmount
                      record.paidamount
                    )}`,
                    style: "workDetails",
                    bold: true,
                  },
                ],
                margin: [350, 20, 0, 0],
                alignment: "right",
              },
              {
                columns: [
                  {
                    text: "Signed By On Behalf Of\nCustomer With Seal And Date",
                    alignment: "center",
                  },
                  {
                    text: `Signed By On Behalf Of\n${record.createdByUser.companyName}`,
                    alignment: "center",
                  },
                ],
                alignment: "justify",
                margin: [0, 50, 0, 0],
              },
            ],
            styles: {
              header: {
                fontSize: 16,
                font: "Helvetica",
                bold: true,
                margin: [0, 0, 0, 5],
              },
              subheader: {
                font: "Helvetica",
                fontSize: 12,
                marginBottom: 5,
              },
              workDetails: {
                font: "Helvetica",
                fontSize: 14,
                alignment: "left",
                border: [false, false, false, false],
              },
              tableLabel: {
                font: "Helvetica",
                bold: true,
                border: [false, false, false, true],
              },
              tableCell: {
                font: "Helvetica",
                fillColor: "#ffffff",
              },
              tableHeader: {
                font: "Helvetica",
                fillColor: "#eeeeee",
                bold: true,
              },
            },
          };
        
            pdfMake.createPdf(docDefinition).download('work-order.pdf');
  }
  catch(error){
      console.log(error)
  }
}
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
          AMC Number
        </div>
      ),
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate("/dashboard/services/amcDetail", { state: record });
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
            <Typography variant="subtitle1">SR:{name}</Typography>
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
      title: "Assignment Start Date",
      key: "startdate",
      dataIndex: "startdate",
    },
    {
      title: "Assignment End Date",
      key: "enddate",
      dataIndex: "enddate",
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
    {
      title: "AMC Download",
      dataIndex: "actionDownload",
      key: "actionDownload",
      render: (_, record) => (
        <IconButton onClick={() => handleWorkInvoice(record)}>
          <Icon>
            <DownloadIcon />
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
          <h2 style={{ margin: 0 }}>View AMC</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>

      <Box sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}>
        {loading=== false ? (
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
            Are you sure you want to delete this AMC?
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
    
    export default  AmcViewTable;