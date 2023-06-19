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
import './customTable.css'
import 'moment-timezone';
import { apiUrl } from 'src/config';

const userId = parseInt(sessionStorage.getItem('user')|| localStorage.getItem('user'))
const dateFormat = 'M/D/YYYY, h:mm:ss A';


const customerType = [
  {
    label: 'Customer',
    value: 'Customer'
  },
  {
    label: 'Vendor',
    value: 'Vendor'
  }
];



const userOptions = [
  {
    label: 'Draft',
    value: 'Draft'
  },
  {
    label: 'Waiting for Approval',
    value: 'Waiting for Approval'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  },
  {
    label: 'Approved',
    value: 'Approved'
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
    id:'cost',
    name:'Unit Price',
    width: 150,
},
  {
      id:'workstation',
      name:'No. Of workstations',
      width: 200,
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


export const AmcEditForm = (props) => {

  const location = useLocation();
  const state = location.state;
console.log(state)



  const [userData, setUserData]= useState([])
  const navigate = useNavigate();
//form state handeling

const [type, setType] = useState(state?.type||"");


const [deliveryDate, setDeliveryDate] = useState(dayjs(state?.originalstartdate|| ''));
const [assignmentEnd, setAssignmentEnd]= useState(dayjs(state?.originalenddate|| ''))

const [status, setStatus] = useState(state?.status || "");
const [contactName,setContactName] = useState(state?.contactPersonName ||'')
const [adminName,setAdminName] = useState(state?.adminPersonName ||'')
const [adminEmail, setAdminEmail] = useState(state?.adminEmail ||'');
const [adminPhone, setAdminPhone] = useState(state?.adminPhoneNumber ||'');
const [inchargeEmail, setInchargeEmail] = useState(state?.contactEmail ||'');
const [phone, setPhone] = useState(state?.contactPhoneNumber ||'');
const [address, setAddress] = useState(state?.deliveryAddress || "");
const [tempId, setTempId] = useState(state?.noncompany?.id);
const [userState, setUserState] = useState(state?.company?.id);
const [terms, setTerms] = useState(state?.termsAndCondition || '');
const [comment, setComment] = useState(state?.comments||'');
const [user, setUser] = useState('')
const [technician, setTechnician] = useState(state?.technicianInfo.id || '');
const [technicianData, setTechnicianData] = useState([]);


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
  const [workstation, setWorkstation] = useState();

  const [userData2, setUserData2] = useState([])
  const [productId, setProductId] = useState()

  const [totalAmount, setTotalAmount] = useState(0);

  const [rowData, setRowData] =useState()
  const [dDate, setDDate] =useState(state?.startdate)
  const [dDate2, setDDate2] =useState(state?.enddate)

  const [Id, setId] = useState()

  const [touched, setTouched] = useState(false);


      //deleted row
  const [deletedRows, setDeletedRows] = useState([]);

  const handleBlur = () => {
    setTouched(true);
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasError = touched && !emailRegex.test(adminEmail);
  const hasError2 = touched && !emailRegex.test(inchargeEmail);

  useEffect(() => {
    axios.get(apiUrl + `getAllWorkOrderItems/${state?.id || state?.workorder?.id}`)
      .then(response => {
       setRowData(response.data)
       setTotalAmount(state?.totalAmount)
      
      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.id, state?.quotation?.id , state?.totalAmount]);

  //currentdate
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
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
      case 'adminname':
        setAdminName(value);
        break;
      case 'adminemail':
        setAdminEmail(value);
        break;
      case 'adminphone':
        setAdminPhone(value);
        break;
      case 'inchargeemail':
        setInchargeEmail(value);
        break;
      case 'mobileno':
        setPhone(value);
        break;
      case 'type':
        setType(value);
        break;
        case 'technician':
          setTechnician(value);
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
    const request1 = axios.get(apiUrl + `getAllTempUsers/${userId}`);
    const request2 = axios.get(apiUrl + `getAllUsersBasedOnType/${userId}`);
  
    Promise.all([request1, request2])
      .then(([response1, response2]) => {
        const tempUsersData = response1.data;
        const usersData = response2.data;
        const combinedData = [...tempUsersData, ...usersData];
        setUserData(combinedData);
        setTechnicianData(tempUsersData)
  
        const selecteduserId = combinedData.find((option) => (option.id === tempId || userState));
        const selecteduser = selecteduserId ? selecteduserId.companyName : '';
        setUser(selecteduser);
 
       
      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.tempUserId, state?.userId]);
 

  const deliveryDateAntd = deliveryDate;
  const deliveryDateJS = deliveryDateAntd ? deliveryDateAntd.toDate() : null;
  const deliveryIST = deliveryDateJS;

 
  const deliveryDateAntd2 = assignmentEnd;
  const deliveryDateJS2 = deliveryDateAntd2 ? deliveryDateAntd2.toDate() : null;
  const deliveryIST2 = deliveryDateJS2;

  const filteredData = technicianData?.filter(item => item.type === 'Technician')

  const handleDateChange = (date) => {
    setDeliveryDate(date);
  };

  const handleDateEnd = (date) => {
    setAssignmentEnd(date)
  };

  //////////////
  //add product//
  /////////////

console.log(user)

  const handleRemoveRow = (idx, row) => () => {

    const deletedRow = { ...row }; 
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
  
      const updatedRows = rowData?.filter((_, index) => index !== idx);
      setRowData(updatedRows);
    
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
        total +
        row.workstationcount * row.unitPrice +
        (row.workstationcount * row.unitPrice * row.igst) / 100,
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
     
      productName &&
      workstation &&
      igst &&
      description
    ) {
      const newRow = {
        Id: Id,
        product: {id: productId},
        productName,
        workOrderId: null,
        unitPrice: parseFloat(price),
        description,
        //createdBy: userId,
        workstationcount: parseFloat(workstation),
        igst: parseFloat(igst),
        comment: comment,
        //createdDate: currentDate,
        //lastModifiedDate: currentDate,
   
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
          row.workstationcount * row.unitPrice +
          (row.workstationcount * row.unitPrice * row.igst) / 100,
        0
      );
  
      setTotalAmount(calculatedTotalAmount);
    }
  };

  


  const handleEditRow = (idx, row) => {

console.log(idx, row)

    const selectedOption = userData2.find((option) => option.productName === row.product.productName);
    const selectedProductId = selectedOption ? selectedOption.id : '';

  setId(row.id)
  setProductId(selectedProductId);
  setProductName(row.product.productName || row.productName);
  setWeight(row.weight);
  setQuantity(row.quantity);
  setWorkstation(row.workstationcount)
  setPrice(row.unitPrice);
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
    setWorkstation('')
  };

  //
  useEffect(() => {
    axios.get(apiUrl + `getAllItem/${userId}`)
      .then(response => {
        setUserData2(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  
  console.log(deliveryIST, deliveryIST2)
  const updatedRows = rowData?.map(({ productName, ...rest }) => rest);
  const deleteRows= deletedRows?.map(({ productName, ...rest }) => rest);

  //post request
  const handleClick = async (event) => {
    let finalAmount = parseFloat(totalAmount?.toFixed(2))

    
    
    event.preventDefault();


    
      if (contactName && userId && phone && status && comment && terms && updatedRows && tempId) {
        try {
          const response = await fetch(apiUrl + 'addWorkOrderWithItems', {
            method: 'POST',
            headers: {
    
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              workorder:{
                id: state?.id,
                contactPersonName: contactName,
                contactPhoneNumber: phone,
                contactEmail: inchargeEmail,
                adminPersonName: adminName,
                adminPhoneNumber: adminPhone,
                adminEmail: adminEmail,   
                status: status,
                type: type,
                startdate: deliveryIST,
                enddate: deliveryIST2,
                createdByUser: {id: userId},
                createdDate: new Date(),
                lastModifiedDate: new Date(),
                comments : comment,
                lastModifiedByUser: {id: userId},
                termsAndCondition: terms,
                //totalAmount: finalAmount,
                technicianInfo: {id: technician},
                noncompany:{id: tempId},
                //company: {id: userState},
      
            },
                workOrderItems: updatedRows,
                deleteWorkOrderItems: deleteRows
        })
          });
          
          if (response.ok) {
            // Redirect to home page upon successful submission
        
           response.json().then(data => {
            navigate('/dashboard/services/amcrDetail', { state: data });
            console.log(data)
      
    });
          } 
        } catch (error) {
          console.error('API call failed:', error);
        }
      } else if (contactName && userId && phone && status && comment && terms && updatedRows && userState){
        try {
          const response = await fetch(apiUrl +'addWorkOrderWithItems', {
            method: 'POST',
            headers: {
    
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              workorder:{
                id: state?.id,
                contactPersonName: contactName,
                contactPhoneNumber: phone,
                contactEmail: inchargeEmail,
                adminPersonName: adminName,
                adminPhoneNumber: adminPhone,
                adminEmail: adminEmail,   
                status: status,
                type: type,
                startdate: deliveryIST,
                enddate: deliveryIST2,
                createdByUser: {id: userId},
                createdDate: new Date(),
                lastModifiedDate: new Date(),
                comments : comment,
                lastModifiedByUser: {id: userId},
                termsAndCondition: terms,
                //totalAmount: finalAmount,
                technicianInfo: {id: technician},
                //noncompany:{id: tempId},
                company: {id: userState},
      
            },
                workOrderItems: updatedRows,
                deleteWorkOrderItems: deleteRows
        })
          });
          
          if (response.ok) {
            // Redirect to home page upon successful submission
        
           response.json().then(data => {
            navigate('/dashboard/services/amcrDetail', { state: data });
            console.log(data)
      
    });
          } 
        } catch (error) {
          console.error('API call failed:', error);
        }
      }
    
    };


  return (
    <div style={{minWidth: "100%" }}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h2>Edit AMC</h2>
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
              md={4}
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
              md={4}
            >
                <DatePicker placeholder="Delivery Date"
                onChange={handleDateChange}
                defaultValue={deliveryDate} 
                format= "YYYY/MM/DD"
                className="css-dev-only-do-not-override-htwhyh"
                style={{ height: '58px', width: '250px' , color: 'red'}}
                height='50px'/>

            </Grid>
            <Grid
              xs={12}
              md={4}
            >
                <DatePicker placeholder="Assignment End Date"
                onChange={handleDateEnd}
                defaultValue={assignmentEnd}
                format= "YYYY/MM/DD"
                className="css-dev-only-do-not-override-htwhyh"
                style={{ height: '58px', width: '250px' , color: 'red'}}
                height='50px'/>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >    <TextField
            fullWidth
            label="Company Name"
            name="user"
            select
            value={user}
            onChange={(e) => {
              const selectedOption = userData?.find((option) => option.companyName === e.target.value);
              if (selectedOption) {
                if (selectedOption.hasOwnProperty('createdByUser')) {
                  setTempId(selectedOption.id || '');
                  setUserState(null)
                } else {
                  setUserState(selectedOption.id || '');
                  setTempId(null)
                }
              }
              setUser(e.target.value);
            }}
            style={{ marginBottom: 10 }}
          >
               {userData
          .filter((option) => option.type === type) 
          .map((option) => (
            option.companyName && (
              <MenuItem 
              key={option.id}
               value={option.companyName}>
                {option.companyName}
              </MenuItem>
            )
          ))}
          </TextField>   
            </Grid>
 
            <Grid
              xs={12}
              md={4}
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
              md={4}
            >
            <TextField

                fullWidth
                label="Technician"
                name="technician"
                select
                value={technician}

                onChange={handleInputChange}

                >
                {filteredData?.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                  >
                    {option.userName}
                  </MenuItem>
                ))}
                </TextField>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField

                    fullWidth
                    label="Admin Name"
                    name="adminname"
                    value={adminName}
                    onChange={handleInputChange}
                
                  >
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField

                    fullWidth
                    label="Admin Email"
                    name="adminemail"
                    helperText={hasError && "Please enter a valid email."}
                    onBlur={handleBlur}
                    error={hasError}
                    value={adminEmail}
                    onChange={handleInputChange}
                  >
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField

                    fullWidth
                    label="Admin Phone"
                    name="adminphone"
                    type='number'
                    value={adminPhone}
                    onChange={handleInputChange}
                  >
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Incharge Name"
                name="contactName"
                value={contactName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField

                    fullWidth
                    label="Incharge Email"
                    name="inchargeemail"
                    value={inchargeEmail}
                    helperText={hasError2 && "Please enter a valid email."}
                    onBlur={handleBlur}
                    error={hasError2}
                    onChange={handleInputChange}
                  >
                  </TextField>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Incharge Phone"
                name="mobileno"
                type='number'
                value={phone}
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
              <div className='modal-content-service'>
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
                              label="No. Of Workstations"
                              name="workstation"
                              type='number'
                              value={workstation}
                              onChange={(e) => setWorkstation(e.target.value)}
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
                              label="IGST"
                              name="igst"
                              type='number'
                              value={igst}
                              onChange={(e) => setIgst(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
                              />
                            </Grid>
                            <Grid
                            xs={12}
                            md={6}
                            >
                              <TextField
                              fullWidth
                              label="Unit Price"
                              name="cost"
                              type='number'
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              style={{ marginBottom: 10 }}
                          
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
                            <button style={{ background: `${primaryColor}`, marginRight: '20px' }} 
                              className='submit' 
                              
                              onClick={toggleForm}>
                                Cancel
                              </button>
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
                          <TableRow>
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
                            key={idx?.id}>
                              <TableCell>
                                <div>{row.description}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.unitPrice}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.workstationcount}</div>
                              </TableCell>
                              <TableCell>
                                <div>{row.igst}</div>
                              </TableCell>
                              <TableCell>
                              <div>
                                {(
                                  ((row.workstationcount * row.unitPrice) +
                                  ((row.workstationcount * row.unitPrice) * row.igst/ 100)).toFixed(2)
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
              <label style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Total Amount : {totalAmount?.toFixed(2)}</label>
          
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
    
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
            />
          </Grid>
          </>
          <Grid
            xs={12}
            md={6}
            >
            <Box sx={{ mt: 2 , mb: 2 }}
            display="flex"
            justifyContent="flex-end"
            marginRight="12px">
            <Button
              color="primary"
              variant="contained"
              align="right"
              onClick={handleClick}
            >
              Create AMC
            </Button>
          </Box>
        </Grid>
    </div>
  );
};

AmcEditForm.propTypes = {
  customer: PropTypes.object.isRequired
};