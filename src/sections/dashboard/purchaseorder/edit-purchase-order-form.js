import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Icon,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { DatePicker } from 'antd';
import './purchase-order.css'
import IconWithPopup from '../user/user-icon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import { primaryColor } from 'src/primaryColor';
import EditIcon from '@mui/icons-material/Edit';
import { Scrollbar } from 'src/components/scrollbar';
import React from 'react';
import { Delete } from '@mui/icons-material';
import './customTable.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';


const userId = parseInt(sessionStorage.getItem('user'))
const dateFormat = 'DD/MM/YYYY';

const customerType = [
   
  {
    label: 'Distributor',
    value: 'Distributor'
  },

  {
    label: 'Customer',
    value: 'Customer'
  }
];

const userOptions = [
  {
    label: 'Open',
    value: 'Open'
  },
  {
    label: 'Waiting for Approval',
    value: 'Waiting for Approval'
  },
  {
    label: 'Pending',
    value: 'Pending'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  },
  {
    label: 'Delivered',
    value: 'Delivered'
  },
];

const tableHeader=[
  {
      id:'product_name',
      name:'Part Description',
      width: 200,
      
  },
  {
      id:'quantity',
      name:'Quantity',
      width: 200,
  },
  {
      id:'weight',
      name:'Weight',
      width: 150,
  },
  {
    id:'size',
    name:'Size',
    width: 150,
},
  {
      id:'cost',
      name:'Cost',
      width: 150,
  },
  {
      id:'cgst',
      name:'CGST',
      width: 150,
  },
  {
    id:'sgst',
    name:'SCGST',
    width: 150,
},
  {
    id:'igst',
    name:'IGST',
    width: 150,
},

  {
    id:'amount',
    name:'Net Amount',
    width: 150,
},
  {
      id:'add',
      name:'',
      width: 50,
  },
  {
      id:'delete',
      name:'',
      width: 50,
  }
];

export const PurchaseOrderEditForm = (props) => {

  const location = useLocation();
  const state = location.state;





  const [userData, setUserData]= useState([])
  const navigate = useNavigate();
//form state handeling

const [type, setType] = useState(state?.type||"");
const [quotation, setQuotation] = useState(state?.quotationId ||'');
const [deliveryDate, setDeliveryDate] = useState(dayjs(state?.deliveryDate, dateFormat));
const [status, setStatus] = useState(state?.status || "");
const [contactName,setContactName] = useState(state?.contactPerson ||'')
const [phone, setPhone] = useState(state?.contactPhone||'');
const [address, setAddress] = useState(state?.deliveryAddress || "");
const [tempId, setTempId] = useState(state?.tempUserId);
const [terms, setTerms] = useState(state?.termsAndCondition || '');
const [comment, setComment] = useState(state?.comments||'');
const [user, setUser] = useState('')
const [payment, setPayment]=useState(state?.paymentMode||"")

const [currentDate, setCurrentDate] = useState('');

//add product state
const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState('');
  const [sgst, setSgst] = useState();
  const [igst, setIgst] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [cgst, setCgst] = useState();
  const [size, setSize] = useState();
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);


  const [userData2, setUserData2] = useState([])
  const [productId, setProductId] = useState()

  const [totalAmount, setTotalAmount] = useState(0);

  const [rowData, setRowData] =useState()
  const [dDate, setDDate] =useState(state?.deliveryDate)
  const [allQuotation, setAllQuotation] = useState([])

  const [Id, setId] = useState()


    //handle file uploads
    const [performaInvoiceFile, setPerformaInvoiceFile] = useState(null);
    const [approvedInvoiceFile, setApprovedInvoiceFile] = useState(null);
    const [deliveryChallanFile, setDeliveryChallanFile] = useState(null);

    //deleted row
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getAllPurchaseOrderDetails/${state?.id || state?.purchaseOrderRec?.id}`)
      .then(response => {
       setRowData(response.data)
       setTotalAmount(state?.totalAmount)
      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.id, state?.purchaseOrderRec?.id, state?.totalAmount]);

  //currentdate
  useEffect(() => {
    const today = new Date();
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('IN', options);
    setCurrentDate(formattedDate);
  }, []);

 const handleInputChange = (event) => {
  const { name, value } = event.target;

  switch (name) {
  
      case 'user':
        setUser(value);
          break;
      case 'contactName':
        setContactName(value);
        break;
      case 'quotation':
        setQuotation(value);
        break;
      case 'mobileno':
        setPhone(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'payment':
        setPayment(value);
            break;
      case 'status':
        setStatus(value);
        break;
    case 'address':
      setAddress(value);
        break;
    default:
      break;
  }
};

   //get temp user
   useEffect(() => {
    const request1 = axios.get(`http://13.115.56.48:8080/techmadhyam/getAllTempUsers/${userId}`);
    const request2 = axios.get(`http://13.115.56.48:8080/techmadhyam/getAllUsersBasedOnType/${userId}`);
  
    Promise.all([request1, request2])
      .then(([response1, response2]) => {
        const tempUsersData = response1.data;
        const usersData = response2.data;
        const combinedData = [...tempUsersData, ...usersData];
        setUserData(combinedData);
  
        const selecteduserId = combinedData.find((option) => (option.id !== 0 && option.id === state?.tempUserId) || option.id === state?.userId);
        const selecteduser = selecteduserId ? selecteduserId.companyName : '';
        setUser(selecteduser);
      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.tempUserId, state?.userId]);

 
  useEffect(() => {
    if (deliveryDate) {
      const deliveryDateJS = deliveryDate.toDate();
      const formattedDeliveryDate = moment(deliveryDateJS).format('DD/MM/YYYY');
      setDDate(formattedDeliveryDate);
    } else {
      setDDate('');
    }
  }, [deliveryDate]);

  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getAllQuotations/${userId}`)
      .then(response => {
        const filteredQuotations = response.data.filter(item => item.status === "Delivered");
        setAllQuotation(filteredQuotations);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  const approvedQuotation = allQuotation.map(item => ({
    value: item.id,
    label: item.contactPersonName
  }));

  const handleDateChange = (date) => {
    setDeliveryDate(date);
  };

  //////////////
  //add product//
  /////////////




  const handleRemoveRow = (idx, row) => () => {

    const deletedRow = { ...row }; 
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
  
      const updatedRows = rowData?.filter((_, index) => index !== idx);
      setRowData(updatedRows);
    
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
          total +
          row.quantity * row.price +
          (row.quantity * row.price * row.cgst) / 100 +
          (row.quantity * row.price * row.igst) / 100 +
          (row.quantity * row.price * row.sgst) / 100,
        0
      );
    
      setTotalAmount(calculatedTotalAmount);
    };

  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
    setEditIndex(null);
    clearFormFields();
  };

  const handleModalClick = (event) => {
    if (event.target.classList.contains('modal')) {
      toggleForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (
      quantity &&
      price &&
      cgst &&
      productName &&
      sgst &&
      igst &&
      description &&
      weight &&
      size
    ) {
      const newRow = {
        id: Id,
        productId,
        productName,
        weight,
        quotationId: quotation,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        cgst: parseFloat(cgst),
        description,
        createdBy: userId,
        size: size,
        sgst: parseFloat(sgst),
        igst: parseFloat(igst),
        comments: comment,
        createdDate: currentDate,
        lastModifiedDate: currentDate,
      };
  
      let updatedRows;
  
      if (editIndex !== null) {
        updatedRows = [...rowData];
        updatedRows[editIndex] = newRow;
        setRowData(updatedRows);
      } else {
        updatedRows = [...rowData, newRow];
        setRowData(updatedRows);
      }
  
      clearFormFields();
      setShowForm(false);
      setEditIndex(null);
  
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
          total +
          row.quantity * row.price +
          (row.quantity * row.price * row.cgst) / 100 +
          (row.quantity * row.price * row.igst) / 100 +
          (row.quantity * row.price * row.sgst) / 100,
        0
      );
  
      setTotalAmount(calculatedTotalAmount);
    }
  };


  const handleEditRow = (idx, row) => {

    console.log(idx, row)

    const selectedOption = userData2.find((option) => option.productName === row.productName);
    const selectedProductId = selectedOption ? selectedOption.id : '';
  setId(row.id)
  setProductId(selectedProductId);
  setProductName(row.productName);
  setWeight(row.weight);
  setQuantity(row.quantity);
  setPrice(row.price);
  setCgst(row.cgst);
  setIgst(row.igst)
  setSgst(row.sgst)
  setSize(row.size)
  setDescription(row.description);
  setEditIndex(idx);
  setShowForm(true);
};
  

  const clearFormFields = () => {
    setProductName('');
    setWeight('');
    setQuantity('');
    setPrice('');
    setCgst('');
    setSize('')
    setIgst('')
    setSgst('')
    setDescription('');
  };

  //
  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getAllItem/${userId}`)
      .then(response => {
        setUserData2(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  
  const updatedRows = rowData?.map(({ productName, ...rest }) => rest);
  const deleteRows= deletedRows?.map(({ productName, ...rest }) => rest);
  //post request
  const handleClick = async (event) => {
    let finalAmount = parseFloat(totalAmount.toFixed(2))

    
    
    event.preventDefault();

    console.log({
      purchaseOrder:{
          id: state?.id,
          quotationId: quotation,
          userId: userId,
          tempUserId :tempId,
          contactPerson: contactName,
          contactPhone: phone,    
          status: status,
          paymentMode: payment,
          type: type,
          deliveryDate: dDate,
          deliveryAddress: address,
          city: null,
          state:null,
          country: null,
          createdBy: userId,
          lastModifiedDate: currentDate,
          comments : comment,
          termsAndCondition: terms,
          totalAmount: finalAmount,
      },
          purchaseOrderDetails: updatedRows,
          deletedPODetails: deleteRows
  })
    
      if (contactName && address && userId && phone && status && address && comment && terms && updatedRows) {
        try {
          const response = await fetch('http://13.115.56.48:8080/techmadhyam/createPurchaseOrder', {
            method: 'POST',
            headers: {
    
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              purchaseOrder:{
                  id: state?.id,
                  quotationId: quotation,
                  userId: userId,
                  tempUserId :tempId,
                  contactPerson: contactName,
                  contactPhone: phone,    
                  status: status,
                  paymentMode: payment,
                  type: type,
                  deliveryDate: dDate,
                  deliveryAddress: address,
                  city: null,
                  state:null,
                  country: null,
                  createdBy: userId,
                  lastModifiedDate: currentDate,
                  comments : comment,
                  termsAndCondition: terms,
                  totalAmount: finalAmount,
                  lastModifiedByUser: {id: userId},
              },
                  purchaseOrderDetails: updatedRows,
                  deletedPODetails: deleteRows
          })
          });
          
          if (response.ok) {
            response.json().then(async (data) => {
              // Performa Invoice upload
              if (performaInvoiceFile) {
                const formData = new FormData();

                
                let jsonBodyData = {};

               let file = performaInvoiceFile;
                jsonBodyData.fileId = 0;
                jsonBodyData.fileName = performaInvoiceFile?.name;
                jsonBodyData.fileType = performaInvoiceFile?.type;
                jsonBodyData.referenceId = data.purchaseOrderRec?.id;
                jsonBodyData.referenceType = 'PurchaseOrder';
                
                formData.append(
                  'file',
                  file
                );
                formData.append('fileWrapper',JSON.stringify(jsonBodyData));

                try {
                  const uploadResponse = await fetch('http://13.115.56.48:8080/techmadhyam/upload', {
                    method: 'POST',
                    body: formData
                  });
          
                  if (uploadResponse.ok) {
                    console.log('Performa Invoice uploaded successfully');
                  } else {
                    console.error('Performa Invoice upload failed');
              
                  }
                } catch (error) {
                  console.error( error);
                
                }
              }
          
              // Approved Invoice upload
              if (approvedInvoiceFile) {
                const formData = new FormData();

                
                let jsonBodyData = {};

               let file = approvedInvoiceFile;
                jsonBodyData.fileId = 0;
                jsonBodyData.fileName = approvedInvoiceFile?.name;
                jsonBodyData.fileType = approvedInvoiceFile?.type;
                jsonBodyData.referenceId = data.purchaseOrderRec?.id;
                jsonBodyData.referenceType = 'PurchaseOrder';
                
                formData.append(
                  'file',
                  file
                );
                formData.append('fileWrapper',JSON.stringify(jsonBodyData));

                try {
                  const uploadResponse = await fetch('http://13.115.56.48:8080/techmadhyam/upload', {
                    method: 'POST',
                    body: formData
                  });
          
                  if (uploadResponse.ok) {
                    console.log('approved Invoice File uploaded successfully');
                  } else {
                    console.error('approved Invoice File upload failed');
                  
                  }
                } catch (error) {
                  console.error( error);
                
                }
              }
          
              // Delivery Challan upload
              if (deliveryChallanFile) {
                const formData = new FormData();

                
                let jsonBodyData = {};

               let file = deliveryChallanFile;
                jsonBodyData.fileId = 0;
                jsonBodyData.fileName = deliveryChallanFile?.name;
                jsonBodyData.fileType = deliveryChallanFile?.type;
                jsonBodyData.referenceId = data.purchaseOrderRec?.id;
                jsonBodyData.referenceType = 'PurchaseOrder';
                
                formData.append(
                  'file',
                  file
                );
                formData.append('fileWrapper',JSON.stringify(jsonBodyData));

                try {
                  const uploadResponse = await fetch('http://13.115.56.48:8080/techmadhyam/upload', {
                    method: 'POST',
                    body: formData
                  });
          
                  if (uploadResponse.ok) {
                    console.log('delivery Challan File uploaded successfully');
                  } else {
                    console.error('delivery Challan File upload failed');
                    return;
                  }
                } catch (error) {
                  console.error( error);
                  return;
                }
              }
          
              navigate('/dashboard/purchaseorder/viewDetail', { state: data });
        });
          } 
        }  catch (error) {
          console.error('API call failed:', error);
        }
      } 
    
    };

    const handlePerformaInvoiceFileChange = (event) => {
      const file = event.target.files[0];
      setPerformaInvoiceFile(file);
    };
    
    const handleApprovedInvoiceFileChange = (event) => {
      const file = event.target.files[0];
      setApprovedInvoiceFile(file);
    };
    
    const handleDeliveryChallanFileChange = (event) => {
      const file = event.target.files[0];
      setDeliveryChallanFile(file);
    };
    
    
    const handleDeleteFile = (fileType) => {
      switch (fileType) {
        case 'performaInvoice':
          setPerformaInvoiceFile(null);
          document.getElementById('performaInvoiceInput').value = '';
          break;
        case 'approvedInvoice':
          setApprovedInvoiceFile(null);
          document.getElementById('approvedInvoiceInput').value = '';
          break;
        case 'deliveryChallan':
          setDeliveryChallanFile(null);
          document.getElementById('deliveryChallanInput').value = '';
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      const getFileAndData = async () => {
        try {
          const apiUrl = `http://13.115.56.48:8080/techmadhyam/getAllFiles/PurchaseOrder/${state?.id || state?.purchaseOrderRec?.id}`;
    
          const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer' 
          });
    
          const fileData = response.data; 
          const metadata = response.headers['x-metadata']; 
    

          console.log('File data:', fileData);
          console.log('Metadata:', metadata);
        } catch (error) {
    
          console.error(error);
        }
      };
    

      getFileAndData();
    }, []);

    // useEffect(() => {
    //   const getFile = async () => {
    //     try {
    //       const fileResponse = await fetch(`http://13.115.56.48:8080/techmadhyam/getAllFiles/PurchaseOrder/${state?.id || state?.purchaseOrderRec?.id}`);
    //       if (fileResponse.ok) {
    //         const fileData = await fileResponse.json();
    //         console.log(fileData);
        
    //       } else {
    //         console.error('Unable to fetch the file');
    //       }
    //     } catch (error) {
    //       console.error(error);
      
    //     }
    //   };
    
    //   getFile();
    // },  [state?.id, state?.purchaseOrderRec?.id]);
    

    
    useEffect(() => {
      const downloadFile = async () => {
        try {
          const downloadResponse = await fetch(`http://13.115.56.48:8080/techmadhyam/getAllFiles/PurchaseOrder/${state?.id || state?.purchaseOrderRec?.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/octet-stream', 
            },
          });
        
          if (downloadResponse.ok) {
            
            const blob = await downloadResponse.blob();
            console.log('Response Blob:', blob);

            setPerformaInvoiceFile(blob);
          } else {
            console.error('File download failed');
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      downloadFile();
    }, [state?.id, state?.purchaseOrderRec?.id]);

    console.log('Performa Invoice File:', performaInvoiceFile?.name);
    console.log('Performa Invoice File:', performaInvoiceFile?.type);

  return (
    <div style={{minWidth: "100%" }}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h2>Edit Purchase Order</h2>
      <IconWithPopup/>
    </div>
    <form>
      <Card>
        <CardHeader title="Product Order Detail" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
             <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    select
                    value={type}
                    onChange={handleInputChange}
                  >
                        {customerType.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))} 
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Payment Mode"
                name="payment"
                value={payment}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            > <TextField
            fullWidth
            label="Company Name"
            name="user"
            select
            value={user}
            onChange={(e) => {
              const selectedOption = userData?.find((option) => option.companyName === e.target.value);
              setTempId(selectedOption?.id || '');
              setUser(e.target.value);
            }}
            style={{ marginBottom: 10 }}
          >
                  {userData
          .filter((option) => option.type === type) 
          .map((option) => (
            option.companyName && (
              <MenuItem key={option.id} 
              value={option.companyName}>
                {option.companyName}
              </MenuItem>
            )
          ))}
          </TextField>
                
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
                <TextField
                    fullWidth
                    label="Quotation"
                    name="quotation"
                    value={quotation}
                    select
                    onChange={handleInputChange}
                  >    
                    {approvedQuotation.map((option) => (
                  <MenuItem 
                  key={option.value} 
                  value={option.value}>
                    {option.label}
                  </MenuItem>
  ))}             
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
                <DatePicker placeholder="Delivery Date"
                onChange={handleDateChange}
                defaultValue={deliveryDate} 
                format={dateFormat}
                className="css-dev-only-do-not-override-htwhyh"
                style={{ height: '58px', width: '250px' , color: 'red'}}
                
             

height='50px'/>

            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField

                    fullWidth
                    label="Status"
                    name="status"
                    value={status}
                    onChange={handleInputChange}
                    select
                  >
                    {userOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Contact Name"
                name="contactName"
                value={contactName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Mobile No."
                name="mobileno"
                value={phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Address"
                multiline
                minRows={3}
                name="address"
                value={address}
                onChange={handleInputChange}   
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider/>
      </Card>
    </form>
    <>
      <Box sx={{ position: 'relative', overflowX: 'auto' }}>
        <div className='purchase-popup'>
        <Grid
            xs={12}
            md={6}
            >
            <Box sx={{ mt: 2 , mb: 2}}
            display="flex"
            justifyContent="flex-end"
            marginRight="12px">
            <Button
              color="primary"
              variant="contained"
              align="right"
              onClick={toggleForm}
            >
              Add Parts
            </Button>
          </Box>
        </Grid>

          {showForm && (
            <div className='modal' 
            onClick={handleModalClick}>
              <div className='modal-content'>
                <h5 className='product-detail-heading'>Add Part Details</h5>
                <form className='form'>
                  {/* Form fields */}
                  <div className='form-row'>
                    <div className='popup-left'>
                      <Grid xs={12} 
                      md={6}>
                        <TextField
                          fullWidth
                          label='Part Name'
                          name='name'
                          select
                          value={productName}
                          onChange={(e) => {
                            const selectedOption = userData2.find(option => option.productName === e.target.value);
                            setProductId(selectedOption.id);
                            setProductName(e.target.value);
                            setDescription(selectedOption.description)
                          }}
                          style={{ marginBottom: 10 }}
                        >
                          {userData2?.map((option) => (
                            <MenuItem key={option.id} 
                            value={option.productName}>
                              {option.productName}
                            </MenuItem>
                          ))}
                          </TextField>
                          </Grid>
                          <Grid
                          xs={12}
                          md={6}
                          >
                              <TextField
                              fullWidth
                              label="Weight"
                              name="weight"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              style={{ marginBottom: 10 }}
                            />
                          </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="SGST"
                              name="sgst"
                              type='number'
                              value={sgst}
                              onChange={(e) => setSgst(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
                              />
                            </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="IGST"
                              name="igst"
                              type='number'
                              value={igst}
                              onChange={(e) => setIgst(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
                              />
                            </Grid>
                          </div>
                          <div className='popup-right'>
                          <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="Quantity"
                              name="quantity"
                              type='number'
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              style={{ marginBottom: 15 }}
                              />
                            </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="Cost"
                              name="cost"
                              type='number'
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
                              />
                            </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="Size"
                              name="size"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
                              />
                            </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="CGST"
                              name="cgst"
                              type='number'
                              value={cgst}
                              onChange={(e) => setCgst(e.target.value)}
                              style={{ marginBottom: 16 }}
                              />
                            </Grid>
                            </div>     
                          </div>
                          <Grid
                          xs={12}
                          md={6}
                          >
                          <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          multiline
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          style={{ marginBottom: 10 }}
                        />
                        </Grid>
                            <div className='submit-purchase'>
                              <button style={{ background: `${primaryColor}` }} 
                              className='submit' 
                              type='submit' 
                              onClick={handleSubmit}>
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                    <Scrollbar>
                      <Table sx={{ minWidth: 800, overflowX: 'auto' }}>
                        <TableHead>
                          <TableRow >
                            {tableHeader.map((item, idx) => (
                            
                              <TableCell sx={{ width: item.width }} 
                              key={idx}>
                                {item.name}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rowData?.map((row, idx) => (
                            <TableRow hover 
                            key={row.id}>
                              <TableCell>
                                <div>{row.description}</div>
                              </TableCell>
                              <TableCell>
                                 <div>{row.quantity}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.weight}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.size}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.price}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.cgst}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.sgst}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.igst}</div>
                              </TableCell>
                           
                              <TableCell>
                              <div>
                                {(
                                  ((row.quantity * row.price) +
                                  ((row.quantity * row.price) * row.cgst/ 100) +
                                  ((row.quantity * row.price) * row.igst / 100) +
                                  ((row.quantity * row.price) * row.sgst / 100)).toFixed(2)
                                )}
                              </div>
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEditRow(idx, row)}>
                                  <Icon>
                                    <EditIcon />
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell align='right'>
                                <IconButton onClick={handleRemoveRow(idx, row)}>
                                  <Icon>
                                    <Delete />
                                  </Icon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Scrollbar>
                  </Box>
                  <br></br>
                <Grid
                xs={12}
                md={6}
              >
              <label style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Total Amount : {totalAmount.toFixed(2)}</label>
          
              </Grid>
              <Grid
                xs={12}
                md={6}
                style={{marginTop: "20px"}}
              >
              <label style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Terms &Conditions :</label>
              <TextField
              fullWidth
              multiline
              rows={4}
              maxRows={8}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
            </Grid>
            <Grid
              xs={12}
              md={6}
              style={{marginTop: "20px"}}
            >
              <label style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Comments :</label>
              <TextField
              fullWidth
              multiline
              rows={2}
              maxRows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
            />
          </Grid>
          </>
          <Grid
            xs={12}
            md={6}
            style={{marginTop: "20px"}}
            >  
            <label style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Upload Documents: </label>
            <Box sx={{ mt: 2 , mb: 2}}
            display="flex"
            justifyContent="start"
            marginRight="12px">
        <div>
          <div style={{ display: 'inline-block' }}>
            <Button
              color="primary"
              variant="contained"
              align="right"
              onClick={() => document.getElementById('performaInvoiceInput').click()}
            >
              Performa Invoice
            </Button>
            {performaInvoiceFile && (
              <Button
                color="secondary"
                onClick={() => handleDeleteFile('performaInvoice')}
                startIcon={<Delete />}
                sx={{ color: 'grey' }}
              >
                Delete
              </Button>
            )}
          </div>
          <input
            type="file"
            id="performaInvoiceInput"
            onChange={handlePerformaInvoiceFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <div style={{ display: 'inline-block' }}>
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              align="right"
              onClick={() => document.getElementById('approvedInvoiceInput').click()}
            >
              Approved Invoice
            </Button>
            {approvedInvoiceFile && (
              <Button
                color="secondary"
                onClick={() => handleDeleteFile('approvedInvoice')}
                startIcon={<Delete />}
                sx={{ color: 'grey' }}
              >
                Delete
              </Button>
            )}
          </div>
          <input
            type="file"
            id="approvedInvoiceInput"
            onChange={handleApprovedInvoiceFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <div style={{ display: 'inline-block' }}>
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              align="right"
              onClick={() => document.getElementById('deliveryChallanInput').click()}
            >
              Delivery Challan
            </Button>
            {deliveryChallanFile && (
              <Button
                color="secondary"
                onClick={() => handleDeleteFile('deliveryChallan')}
                startIcon={<Delete />}
                sx={{ color: 'grey' }}
              >
                Delete
              </Button>
            )}
          </div>
          <input
            type="file"
            id="deliveryChallanInput"
            onChange={handleDeliveryChallanFileChange}
            style={{ display: 'none' }}
          />
        </div>
          </Box>
       
            <Box sx={{ mt: 3 , mb: 2 }}
            display="flex"
            justifyContent="flex-end"
            marginRight="12px">
            <Button
              color="primary"
              variant="contained"
              align="right"
              onClick={handleClick}
            >
              Place Order
            </Button>
          </Box>
        </Grid>
    </div>
  );
};

PurchaseOrderEditForm.propTypes = {
  customer: PropTypes.object.isRequired
};
