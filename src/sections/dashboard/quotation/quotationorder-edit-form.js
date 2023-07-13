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
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import 'moment-timezone';
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';


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

export const QuotationOrderEditForm = (props) => {

  const location = useLocation();
  const state = location.state;
console.log(state)



  const [userData, setUserData]= useState([])
  const navigate = useNavigate();
//form state handeling

const [type, setType] = useState(state?.type||"");
const [deliveryDate, setDeliveryDate] = useState(dayjs(state?.originalDeliveryDate|| ''));
const [status, setStatus] = useState(state?.status || "");
const [contactName,setContactName] = useState(state?.contactPersonName ||'')
const [phone, setPhone] = useState(state?.contactPhoneNumber ||'');
const [address, setAddress] = useState(state?.deliveryAddress || "");
const [tempId, setTempId] = useState(state?.tempUser?.id);
const [userState, setUserState] = useState(state?.companyuser?.id);
const [user, setUser] = useState(state?.tempUser?.id ||state?.companyuser?.id||'')
const [terms, setTerms] = useState(state?.termsAndCondition || '');
const [comment, setComment] = useState(state?.comments||'');



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
  const [dDate, setDDate] =useState()

  const [Id, setId] = useState()

      // country, state, city API access token
      const [accessToken, setAccessToken] = useState(null);



      //state management for countries,states and cities
      const [countries, setCountries] = useState([]);
      const [states, setStates]= useState([])
      const [cities, setCities]= useState([])
      const [currentCountry, setCurrentCountry]= useState(state?.country ||'')
      const [currentState, setCurrentState]= useState(state?.state ||'')
      const [currentCity, setCurrentCity] =useState(state?.city ||'')
      const [zipcode, setZipcode]= useState(state?.pinCode ||'')


      //deleted row
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    axios.get(apiUrl +`getAllQuotationDetails/${state?.id || state?.quotation?.id}`)
      .then(response => {

        const updatedData = response.data.map(obj => {
          let parsedProductId;
          let parsedProductName;
          try {
            const parsedProduct = obj.product;
            parsedProductId = parsedProduct.id;
            parsedProductName = parsedProduct.productName
          } catch (error) {
            console.error("Error parsing product JSON for object:", obj, error);
            parsedProductId = null;
            parsedProductName= null
          }
  
          return {
            ...obj,
            productName: parsedProductName,
            productId: parsedProductId ,
            product:{id: parsedProductId}
          };
        });

       setRowData(updatedData)
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

console.log(rowData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken', {
          headers: {
            'Accept': 'application/json',
            'api-token': '8HWETQvEFegKi6tGPUkSWDiQKfW8UdZxPqbzHX6JdShA3YShkrgKuHUbnTMkd11QGkE',
            'user-email': 'mithesh.dev.work@gmail.com'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
  
        const data = await response.json();
  
        setAccessToken(data.auth_token);
  
      } catch (error) {
        console.error(error);
  
      }
    };
  
    fetchData();
  }, []);
  //fetches country list for dropdown and pushesh it to state which is later mapped 
  const fetchCountries = useCallback(async () => {
    try {
      const response = await fetch("https://www.universal-tutorial.com/api/countries/", {
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Accept": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, [accessToken]);
  
  //using useeffect to prevent fetch request being called on render
  useEffect(()=>{
    fetchCountries()
  },[fetchCountries])
  
  //mapping countries to MUI select input field
  const userOptionsCountry = useMemo(() => {
    return countries.map(country => ({
      label: country.country_name,
      value: country.country_name
    }));
  }, [countries]);
  
  //mapping states to MUI select input field
  const userOptionsState = useMemo(() => {
    return states.map(state => ({
      label: state.state_name,
      value: state.state_name
    }));
  }, [states]);
  
  //mapping cities to MUI select input field
  const userOptionsCities = useMemo(() => {
    return cities.map(city => ({
      label: city.city_name,
      value: city.city_name
    }));
  }, [cities]);
  
  //fetches states list for dropdown and pushesh it to setStates which is later mapped 
  const handleCountry = async (event) => {
    try {
      setCurrentCountry(event.target.value);
      const response = await fetch(`https://www.universal-tutorial.com/api/states/${event.target.value}`, {
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Accept": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  
  //fetches cities list for dropdown and pushesh it to setCities which is later mapped 
  const handleState = async (event) => {
    try {
      setCurrentState(event.target.value);
      const response = await fetch(`https://www.universal-tutorial.com/api/cities/${event.target.value}`, {
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Accept": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`https://www.universal-tutorial.com/api/states/${currentCountry}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Accept': 'application/json'
          }
        });

        if (response.status === 200) {
          const data = response.data;
          setStates(data);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    if (currentCountry && accessToken) {
      fetchStates();
    }
  }, [currentCountry, accessToken]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`https://www.universal-tutorial.com/api/cities/${currentState}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Accept': 'application/json'
          }
        });

        if (response.status === 200) {
          const data = response.data;
          setCities(data);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    if (currentState && accessToken) {
      fetchCities();
    }
  }, [currentState, accessToken]);
  
  //sets default country to India and fetches state list for India and is pushed to setStates
  const handleDefaultState = async () => {
  try {;
  if (currentCountry === 'India') {
    const response = await fetch('https://www.universal-tutorial.com/api/states/India', {
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setStates(data);
  }
  } catch (error) {
  console.error("Error fetching states:", error);
  }
  };
  
  //sets current city value in MUI select field onchange event
  const handleCities = async (event) => {
  setCurrentCity(event.target.value);
  }

 const handleInputChange = (event) => {
  const { name, value } = event.target;

  switch (name) {
  
      case 'user':
        setUser(value);
          break;
      case 'contactName':
        setContactName(value);
        break;
      case 'mobileno':
        setPhone(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'status':
        setStatus(value);
        break;
        case 'zipcode':
          setZipcode(value);
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
    const request1 = axios.get(apiUrl +`getAllTempUsers/${userId}`);
    const request2 = axios.get(apiUrl +`getAllUsersBasedOnType/${userId}`);
  
    Promise.all([request1, request2])
      .then(([response1, response2]) => {
        const tempUsersData = response1.data;
        const usersData = response2.data;
        const combinedData = [...tempUsersData, ...usersData];
        setUserData(combinedData);
  
        const selecteduserId = combinedData.find((option) => (option.id !== 0 && option.id === state?.tempUserId) || option.id === state?.userId);
        const selecteduser = selecteduserId ? selecteduserId.companyName : '';

      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.tempUserId, state?.userId]);

 
  const deliveryDateAntd = deliveryDate;
  const deliveryDateJS = deliveryDateAntd ? deliveryDateAntd.toDate() : null;
  
  const deliveryIST = deliveryDateJS;


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
      productName &&
      description &&
      weight &&
      size
    ) {
      const newRow = {
        id: Id,
        product: { id: productId },
        productName,
        weight,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        description,
        createdBy: userId,
        size: size,
        cgst: parseFloat(cgst) || 0,
        sgst: parseFloat(sgst) || 0,
        igst: parseFloat(igst) || 0,
        comments: comment,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
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
    axios.get(apiUrl +`getAllItem/${userId}`)
      .then(response => {
        setUserData2(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  
  const updatedRows = rowData?.map(({ productName, inventory, productId,  ...rest }) => rest);
  const deleteRows= deletedRows?.map(({ productName, inventory, productId,  ...rest }) => rest);

  //post request
  const handleClick = async (event) => {
    let finalAmount = parseFloat(totalAmount.toFixed(2))

    event.preventDefault();

      if (contactName) {
        try {
          const response = await fetch(apiUrl +'addQuoatation', {
            method: 'POST',
            headers: {
    
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quotation:{
                  id: state?.id,
                  createdBy: userId,
                  ...(tempId && { tempUser: { id: tempId } }),
                  ...(userState && { companyuser: { id: userState } }),
                  contactPersonName: contactName,
                  contactPhoneNumber: phone,    
                  status: status,
                  category: state?.category ,
                  type: type,
                  deliveryAddress: address,
                  city: currentCity,
                  state: currentState,
                  country: currentCountry,
                  pinCode: zipcode,
                  deliveryDate: deliveryIST,
                  lastModifiedDate: new Date(),
                  lastModifiedByUser: {id: userId},
                  createdDate: state?.originalcreatedDate,
                  comments : comment,
                  termsAndCondition: terms,
                  totalAmount: finalAmount,
              },
                  quotationDetails: updatedRows,
                  deletedQuotationDetails: deleteRows
          })
          });
          
          if (response.ok) {
            // Redirect to home page upon successful submission
        
           response.json().then(data => {
            navigate('/dashboard/quotation/viewDetail', { state: data });
            console.log(data)
      
    });
          } 
        } catch (error) {
          console.error('API call failed:', error);
        }
      } 
    
    };


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
          <h2 style={{ margin: 0 }}>Edit Purchase Quotation Order</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <form>
        <Card>
          <CardHeader title="Order Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
             
                  value={type}
            
                >
  
                </TextField>
              </Grid>
              <Grid xs={12} md={6}></Grid>
              <Grid xs={12} md={6}>
                {" "}
                <TextField
                  fullWidth
                  label="Company Name"
                  name="user"
                  select
                  value={user}
                  onChange={(e) => {
                    const selectedOption = userData?.find(
                      (option) => option.id === e.target.value
                    );
                    if (selectedOption) {
                      if (selectedOption.hasOwnProperty("createdByUser")) {
                        setTempId(selectedOption.id || "");
                        setUserState(null);
                      } else {
                        setUserState(selectedOption.id || "");
                        setTempId(null);
                      }
                    }
                    setUser(e.target.value);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {userData
                    .filter((option) => option.type === type)
                    .map(
                      (option) =>
                        option.companyName && (
                          <MenuItem key={option.id} value={option.id}>
                            {option.companyName}
                          </MenuItem>
                        )
                    )}
                </TextField>
              </Grid>
              <Grid />
              <Grid xs={12} md={6}>
                <DatePicker
                  placeholder="Delivery Date"
                  onChange={handleDateChange}
                  defaultValue={deliveryDate}
                  format="YYYY/MM/DD"
                  className="css-dev-only-do-not-override-htwhyh"
                  style={{ height: "58px", width: "250px", color: "red" }}
                  height="50px"
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                  select
                >
                  {userOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  name="contactName"
                  value={contactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile No."
                  name="mobileno"
                  type="number"
                  value={phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shipping Address"
                  multiline
                  minRows={3}
                  name="address"
                  value={address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid />
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  required
                  select
                  defaultValue=""
                  value={currentCountry}
                  onChange={handleCountry}
                >
                  {userOptionsCountry?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  required
                  select
                  defaultValue=""
                  value={currentState}
                  onChange={handleState}
                  onFocus={handleDefaultState}
                >
                  {userOptionsState?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  required
                  select
                  defaultValue=""
                  value={currentCity}
                  onChange={handleCities}
                >
                  {userOptionsCities?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ZipCode"
                  name="zipcode"
                  required
                  value={zipcode}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
      <>
        <Box sx={{ position: "relative", overflowX: "auto" }}>
          <div className="purchase-popup">
            <Grid xs={12} md={6}>
              <Box
                sx={{ mt: 2, mb: 2 }}
                display="flex"
                justifyContent="flex-end"
                marginRight="12px"
              >
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
              <div className="modal" onClick={handleModalClick}>
                <div className="modal-content">
                  <h5 className="product-detail-heading">Add Part Details</h5>
                  <form className="form">
                    {/* Form fields */}
                    <div className="form-row">
                      <div className="popup-left">
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Part Name"
                            name="name"
                            select
                            value={productName}
                            onChange={(e) => {
                              const selectedOption = userData2.find(
                                (option) =>
                                  option.productName === e.target.value
                              );
                              setProductId(selectedOption.id);
                              setProductName(e.target.value);
                              setDescription(selectedOption.description);
                                    setCgst(selectedOption.cgst);
                                    setIgst(selectedOption.igst);
                                    setSgst(selectedOption.sgst);
                            }}
                            style={{ marginBottom: 10 }}
                          >
                            {userData2?.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.productName}
                              >
                                {option.productName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Weight"
                            name="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="SGST"
                            name="sgst"
                            type="number"
                            value={sgst}
                            onChange={(e) => {
                              setSgst(e.target.value);
                              setIgst(""); // Reset igst when sgst is changed
                            }}
                            disabled={igst !== "" && igst !== 0}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="CGST"
                            name="cgst"
                            required
                            type="number"
                            value={cgst}
                            onChange={(e) => {
                              setCgst(e.target.value);
                              setIgst(""); // Reset igst when cgst is changed
                            }}
                            disabled={igst !== "" && igst !== 0}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                      </div>
                      <div className="popup-right">
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={{ marginBottom: 15 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Cost"
                            name="cost"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Size"
                            name="size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="IGST"
                            name="igst"
                            required
                            type="number"
                            value={igst}
                            onChange={(e) => {
                              setIgst(e.target.value);
                              setSgst(""); // Reset sgst when igst is changed
                              setCgst(""); // Reset cgst when igst is changed
                            }}
                            disabled={
                              (cgst !== "" && cgst !== 0) ||
                              (sgst !== "" && sgst !== 0)
                            }
                            style={{ marginBottom: 16 }}
                          />
                        </Grid>
                      </div>
                    </div>
                    <Grid xs={12} md={6}>
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
                    <div className="submit-purchase">
                      <button
                        style={{
                          background: `${primaryColor}`,
                          marginRight: "20px",
                        }}
                        className="submit"
                        onClick={toggleForm}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ background: `${primaryColor}` }}
                        className="submit"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <Scrollbar>
            <Table sx={{ minWidth: 800, overflowX: "auto" }}>
              <TableHead>
                <TableRow>
                  {tableHeader.map((item, idx) => (
                    <TableCell sx={{ width: item.width }} key={idx}>
                      {item.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData?.map((row, idx) => (
                  <TableRow hover key={idx?.id}>
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
                          row.quantity * row.price +
                          (row.quantity * row.price * row.cgst) / 100 +
                          (row.quantity * row.price * row.igst) / 100 +
                          (row.quantity * row.price * row.sgst) / 100
                        ).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditRow(idx, row)}>
                        <Icon>
                          <EditIcon />
                        </Icon>
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
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
        <Grid xs={12} md={6}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Total Amount : {totalAmount.toFixed(2)}
          </label>
        </Grid>
        <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Terms &Conditions :
          </label>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Comments :
          </label>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Grid>
      </>
      <Grid xs={12} md={6}>
        <Box
          sx={{ mt: 2, mb: 2 }}
          display="flex"
          justifyContent="flex-end"
          marginRight="12px"
        >
          <Button
            color="primary"
            variant="contained"
            align="right"
            onClick={handleClick}
          >
            Create Quotation
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

QuotationOrderEditForm.propTypes = {
  customer: PropTypes.object.isRequired
};