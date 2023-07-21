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
import './sales-order.css'
import IconWithPopup from '../user/user-icon';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';
import { primaryColor } from 'src/primaryColor';
import EditIcon from '@mui/icons-material/Edit';
import { Scrollbar } from 'src/components/scrollbar';
import React from 'react';
import { Delete } from '@mui/icons-material';
import './customTable.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';



const userId = parseInt(sessionStorage.getItem('user') || localStorage.getItem('user'))
const dateFormat = 'M/D/YYYY, h:mm:ss A';



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

export const SalesOrderEditForm = (props) => {

  const location = useLocation();
  const state = location.state;

  console.log(state)



  const [userData, setUserData]= useState([])
  const navigate = useNavigate();
//form state handeling

const [type, setType] = useState(state?.type||"");
const [quotation, setQuotation] = useState(state?.quotid||'');
const [deliveryDate, setDeliveryDate] = useState(dayjs(state?.originalDeliveryDate|| ''));
const [status, setStatus] = useState(state?.status || "");
const [contactName,setContactName] = useState(state?.contactPerson||'')
const [phone, setPhone] = useState(state?.contactPhone||'');
const [address, setAddress] = useState(state?.deliveryAddress || "");
const [tempId, setTempId] = useState(state?.tempUser?.id);
const [userState, setUserState] = useState(state?.companyuser?.id);
const [terms, setTerms] = useState(state?.termsAndCondition || '');
const [comment, setComment] = useState(state?.comments||'');
const [user, setUser] = useState(state?.tempUser?.id ||state?.companyuser?.id||'')
const [payment, setPayment]= useState(state?.paymentMode||'')
const [deliveryMode, setDeliveryMode]= useState(state?.modeofdelivery||'')


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
    const [netAmount, setNetAmount] = useState();
  const [discount, setDiscount] = useState();
  

  const [userData2, setUserData2] = useState([])
  const [productId, setProductId] = useState()
  const [Id, setId] = useState()

  const [totalAmount, setTotalAmount] = useState(0);
    const [totalCgst, setTotalCgst] = useState(0);
    const [totalIgst, setTotalIgst] = useState(0);
  const [totalSgst, setTotalSgst] = useState(0);
     const [totalCost, setTotalCost] = useState(0);
 

  const [rowData, setRowData] =useState()
  const [dDate, setDDate] =useState(state?.deliveryDate)
  //deleted row
  const [deletedRows, setDeletedRows] = useState([]);

  const [inventoryData, setInventoryData] =useState()

  const [inventoryId, setInventoryId] = useState()
  const [productDescription, setProductDescription] = useState('');
  const [allQuotation, setAllQuotation] = useState([])


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

  useEffect(() => {
    axios
      .get(
        apiUrl + `getAllSalesOrderDetails/${state?.id || state?.soRecord?.id}`
      )
      .then((response) => {
        const updatedData = response.data.map((obj) => {
          let parsedInventoryId;
          try {
            const parsedInventory = obj.inventory;
            parsedInventoryId = parsedInventory.id;
          } catch (error) {
            console.error(
              "Error parsing inventory JSON for object:",
              obj,
              error
            );
            parsedInventoryId = null;
          }

          const netAmount =
            obj.quantity * obj.price +
            (obj.quantity * obj.price * obj.cgst) / 100 +
            (obj.quantity * obj.price * obj.igst) / 100 +
            (obj.quantity * obj.price * obj.sgst) / 100;
          const discountedAmount =
            netAmount - (netAmount * obj.discountpercent) / 100;

          return {
            ...obj,
            inventory: { id: parsedInventoryId },
            netAmount: parseFloat(discountedAmount.toFixed(2)),
          };
        });
        setRowData(updatedData);
        setTotalAmount(state?.totalAmount);
        setTotalCgst(state?.totalcgst);
        setTotalIgst(state?.totaligst);
        setTotalSgst(state?.totalsgst);
        setTotalCost(state?.totalcost)

        console.log(updatedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    state?.id,
    state?.soRecord?.id,
    state?.totalAmount,
    state?.totalcgst,
    state?.totaligst,
    state?.totalsgst,
    state?.totalCost
  ]);
//inventory 
  useEffect(() => {
    axios.get(apiUrl +`getInventoryByUserId/${userId}`)
      .then(response => {
        setInventoryData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  // const parsedInventory = JSON.parse(rowData.inventory);



  //currentdate
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    setCurrentDate(formattedDate);
  }, []);


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
      case 'quotation':
        setQuotation(value);
        break;
      case 'mobileno':
        setPhone(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'delivery':
          setDeliveryMode(value);
          break;
      case 'payment':
        setPayment(value);
        break;
        case 'zipcode':
          setZipcode(value);
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


console.log(deliveryDate)
console.log(deliveryIST)

  useEffect(() => {
    axios.get(apiUrl +`getAllQuotations/${userId}`)
      .then(response => {
        const filteredQuotations = response.data.filter(
          (item) =>
            item.status === "Delivered" && item.category === "Sales Quotation"
        );
        setAllQuotation(filteredQuotations);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  const approvedQuotation = allQuotation.map(item => ({
    value: item.id,
    label: item.id
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
          (total, row) => total + row.netAmount,
          0
        );

     const calcTotalCgst = updatedRows.reduce((total, row) => {
       const discountFactor =
         row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
       const discountedPrice = row.price * discountFactor;
       console.log(discountedPrice);
       const cgstAmount = (row.quantity * discountedPrice * row.cgst) / 100;
       return total + cgstAmount;
     }, 0);

     const calcTotalIgst = updatedRows.reduce((total, row) => {
       const discountFactor =
         row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
       const discountedPrice = row.price * discountFactor;
       console.log(discountedPrice);
       const igstAmount = (row.quantity * discountedPrice * row.igst) / 100;
       return total + igstAmount;
     }, 0);
     const calcTotalSgst = updatedRows.reduce((total, row) => {
       const discountFactor =
         row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
       const discountedPrice = row.price * discountFactor;
       console.log(discountedPrice);
       const sgstAmount = (row.quantity * discountedPrice * row.sgst) / 100;
       return total + sgstAmount;
     }, 0);

       const calcTotalCost = updatedRows.reduce((total, row) => {
         const discountFactor =
           row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
         const discountedPrice = row.price * discountFactor;
         const cost = row.quantity * discountedPrice;
         return total + cost;
       }, 0);

       setTotalAmount(calculatedTotalAmount);
       setTotalCgst(calcTotalCgst);
       setTotalIgst(calcTotalIgst);
       setTotalSgst(calcTotalSgst);
       setTotalCost(calcTotalCost);
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
    useEffect(() => {
      const calculatedNetAmount =
        quantity * price +
        (quantity * price * cgst) / 100 +
        (quantity * price * igst) / 100 +
        (quantity * price * sgst) / 100;
      const discountedAmount =
        calculatedNetAmount - (calculatedNetAmount * discount) / 100;
      setNetAmount(discountedAmount.toFixed(2));
    }, [quantity, price, cgst, igst, sgst, discount]);

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
     const selectedOption = inventoryData.find((option) => option.id === inventoryId);
  
    if (parseInt(quantity) > selectedOption.quantity) {
      notify(
        "error",
        `Insufficient Quantity in Inventory. Quantity must be below ${selectedOption.quantity}`
      );
      return;
    }

      const newRow = {
        id: Id,
        inventory: { id: inventoryId },
        productDescription,
        productId,
        productName,
        weight,
        discountpercent: parseFloat(discount),
        netAmount: parseFloat(netAmount),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        cgst: parseFloat(cgst),
        description,
        createdBy: userId,
        size: size,
        sgst: parseFloat(sgst),
        igst: parseFloat(igst),
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
            (total, row) => total + row.netAmount,
            0
          );

        const calcTotalCgst = updatedRows.reduce((total, row) => {
          const discountFactor =
            row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
          const discountedPrice = row.price * discountFactor;
          console.log(discountedPrice);
          const cgstAmount = (row.quantity * discountedPrice * row.cgst) / 100;
          return total + cgstAmount;
        }, 0);

        const calcTotalIgst = updatedRows.reduce((total, row) => {
          const discountFactor =
            row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
          const discountedPrice = row.price * discountFactor;
          console.log(discountedPrice);
          const igstAmount = (row.quantity * discountedPrice * row.igst) / 100;
          return total + igstAmount;
        }, 0);
        const calcTotalSgst = updatedRows.reduce((total, row) => {
          const discountFactor =
            row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
          const discountedPrice = row.price * discountFactor;
          console.log(discountedPrice);
          const sgstAmount = (row.quantity * discountedPrice * row.sgst) / 100;
          return total + sgstAmount;
        }, 0);

        const calcTotalCost = updatedRows.reduce((total, row) => {
          const discountFactor =
            row.discountpercent !== 0 ? 1 - row.discountpercent / 100 : 1;
          const discountedPrice = row.price * discountFactor;
          const cost = row.quantity * discountedPrice;
          return total + cost;
        }, 0);

        setTotalAmount(calculatedTotalAmount);
        setTotalCgst(calcTotalCgst);
        setTotalIgst(calcTotalIgst);
        setTotalSgst(calcTotalSgst);
        setTotalCost(calcTotalCost);
    }
  };


  const handleEditRow = (idx, row) => {


  const selectedOption = inventoryData.find((option) => option.productName === row.productName);
  const selectedProductId = selectedOption ? selectedOption.productId : '';



  setId(row.id)
  setProductId(selectedProductId);
  setInventoryId(row.inventory.id)
  setProductName(row.inventory.id);
  setWeight(row.weight);
  setQuantity(row.quantity);
  setPrice(row.price);
  setCgst(row.cgst);
  setIgst(row.igst)
  setSgst(row.sgst)
    setSize(row.size)
     setDiscount(row.discountpercent);
     setNetAmount(row.netAmount);
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
        setDiscount("");
        setNetAmount("");
    setId(undefined)
  };

  //get all parts
  useEffect(() => {
    axios.get(apiUrl +`getAllItem/${userId}`)
      .then(response => {
        setUserData2(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  
  const updatedRows = rowData?.map(
    ({ productName, productDescription, productId, netAmount, ...rest }) => rest
  );
  const deleteRows = deletedRows?.map(
    ({ productName, productDescription, productId, netAmount, ...rest }) => rest
  );
  //post request
  const handleClick = async (event) => {
    let finalAmount = parseFloat(totalAmount.toFixed(2))

    
    
    event.preventDefault();
    
      if (contactName && address && userId && phone && status && address && comment && terms && updatedRows) {
        try {
          const response = await fetch(apiUrl + "createSalesOrder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              salesOrder: {
                id: state?.id,
                ...(quotation && { quotid: quotation }),
                ...(tempId && { tempUser: { id: tempId } }),
                ...(userState && { companyuser: { id: userState } }),
                contactPerson: contactName,
                contactPhone: phone,
                status: status,
                paymentMode: payment,
                type: type,
                deliveryDate: deliveryIST,
                deliveryAddress: address,
                city: currentCity,
                state: currentState,
                country: currentCountry,
                pinCode: zipcode,
                createdBy: userId,
                lastModifiedDate: new Date(),
                createdDate: state?.originalcreatedDate,
                comments: comment,
                termsAndCondition: terms,
                paidamount: state?.paidamount,
                totalcgst: totalCgst,
                totalsgst: totalSgst,
                totaligst: totalIgst,
                totalcost: totalCost,
                modeofdelivery: deliveryMode,
                totalAmount: finalAmount,
                lastModifiedByUser: { id: userId },
              },
              salesOrderDetails: updatedRows,
              deletedSODetails: deleteRows,
            }),
          });
          
          if (response.ok) {
            // Redirect to home page upon successful submission
           response.json().then(data => {

          
            navigate(`/dashboard/orders/viewDetail/${state?.id}`, { state: data });
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
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
          <h2 style={{ margin: 0 }}>Edit Sales Order</h2>
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
          <CardHeader title="Product Order Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  value={type}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Mode"
                  name="payment"
                  value={payment}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="user"
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
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
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quotation"
                  name="quotation"
                  value={quotation}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  onChange={handleInputChange}
                >
                  {approvedQuotation.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <DatePicker
                  placeholder="Delivery Date"
                  onChange={handleDateChange}
                  defaultValue={deliveryDate}
                  format="YYYY-MM-DD"
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
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
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
                  label="Mode of Delivery"
                  name="delivery"
                  required
                  value={deliveryMode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid />
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
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
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
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
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
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
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
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            value={productName}
                            onChange={(e) => {
                              const selectedOption = inventoryData.find(
                                (option) => option.id === e.target.value
                              );
                              if (selectedOption) {
                                setProductId(selectedOption.product.id);
                                setProductName(e.target.value);
                                setWeight(selectedOption.weight);
                                setSgst(selectedOption.sgst);
                                setCgst(selectedOption.cgst);
                                setIgst(selectedOption.igst);
                                setQuantity(1);
                                setSize(selectedOption.size);
                                setPrice(selectedOption.price);
                                setDiscount(0);
                                setInventoryId(selectedOption.id);
                                setDescription(
                                  selectedOption.product.description
                                );
                                setProductDescription(
                                  selectedOption.product.description
                                );
                              }
                            }}
                            style={{ marginBottom: 10 }}
                          >
                            {inventoryData.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.product.productName}
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
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="CGST"
                            name="cgst"
                            type="number"
                            value={cgst}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>

                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Discount in %"
                            required
                            name="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
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
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue >= 0) {
                                setQuantity(inputValue);
                              }
                            }}
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
                            type="number"
                            value={igst}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Net Amount"
                            required
                            name="netamount"
                            type="number"
                            value={netAmount}
                            onChange={(e) => setNetAmount(e.target.value)}
                            style={{ marginBottom: 10 }}
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
                        rows={2}
                        value={description}
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
                  <TableRow hover key={idx.id}>
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
                      <div>{row.netAmount}</div>
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
            Total Amount : {totalAmount?.toFixed(2)}
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
            maxRows={8}
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
            maxRows={4}
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
            Place Order
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

SalesOrderEditForm.propTypes = {
  customer: PropTypes.object.isRequired
};
