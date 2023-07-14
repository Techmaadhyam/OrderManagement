import PropTypes from "prop-types";
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
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { DatePicker } from "antd";
import "./purchase-order.css";
import IconWithPopup from "../user/user-icon";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { primaryColor } from "src/primaryColor";
import EditIcon from "@mui/icons-material/Edit";
import { Scrollbar } from "src/components/scrollbar";
import React from "react";
import { Delete } from "@mui/icons-material";
import "./customTable.css";
import { useNavigate } from "react-router-dom";
import "moment-timezone";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import {
  fetchAccessToken,
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchIndianStates,
} from "src/utils/api-service";

//get userId from session storage
const userId = parseInt(
  sessionStorage.getItem("user") || localStorage.getItem("user")
);

//status dropdown
const userOptions = [
  {
    label: "Draft",
    value: "Draft",
  },
  {
    label: "Waiting for Approval",
    value: "Waiting for Approval",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Approved",
    value: "Approved",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
];

//parts row heading and width
const tableHeader = [
  {
    id: "product_name",
    name: "Part Description",
    width: 200,
  },
  {
    id: "quantity",
    name: "Quantity",
    width: 200,
  },
  {
    id: "weight",
    name: "Weight",
    width: 150,
  },
  {
    id: "size",
    name: "Size",
    width: 150,
  },
  {
    id: "cost",
    name: "Cost",
    width: 150,
  },
  {
    id: "cgst",
    name: "CGST",
    width: 150,
  },
  {
    id: "sgst",
    name: "SCGST",
    width: 150,
  },
  {
    id: "igst",
    name: "IGST",
    width: 150,
  },

  {
    id: "amount",
    name: "Net Amount",
    width: 150,
  },
  {
    id: "add",
    name: "",
    width: 50,
  },
  {
    id: "delete",
    name: "",
    width: 50,
  },
];

export const PurchaseOrderCreateForm = (props) => {
  //used to store company names from 2 diffrent API's
  const [userData, setUserData] = useState([]);
  //store parts name from API
  const [userData2, setUserData2] = useState([]);

  //used to navigate to diffrent section via react router and pass state
  const navigate = useNavigate();

  //form state managment
  const [userName, setUserName] = useState("");
  const [type, setType] = useState("Vendor");
  const [quotation, setQuotation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tempId, setTempId] = useState();
  const [userState, setUserState] = useState();
  const [terms, setTerms] = useState("");
  const [comment, setComment] = useState("");

  //add/edit parts state managment
  const [productName, setProductName] = useState("");
  const [weight, setWeight] = useState("");
  const [sgst, setSgst] = useState();
  const [igst, setIgst] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [cgst, setCgst] = useState();
  const [size, setSize] = useState();
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [payment, setPayment] = useState("");
  const [productId, setProductId] = useState();
  const [salesUser, setSalesUser] = useState();
  const [allQuotation, setAllQuotation] = useState([]);

  //store total amount
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCgst, setTotalCgst] = useState(0);
  const [totalIgst, setTotalIgst] = useState(0);
  const [totalSgst, setTotalSgst] = useState(0);

  //handle file uploads
  const [performaInvoiceFile, setPerformaInvoiceFile] = useState(null);
  const [approvedInvoiceFile, setApprovedInvoiceFile] = useState(null);
  const [deliveryChallanFile, setDeliveryChallanFile] = useState(null);

  // country, state, city API access token
  const [accessToken, setAccessToken] = useState(null);

  //state management for countries,states and cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("India");
  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [zipcode, setZipcode] = useState("");

  //get access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await fetchAccessToken();
        setAccessToken(accessToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  //fetches country list for dropdown and pushesh it to state which is later mapped
  const fetchCountriesData = useCallback(async () => {
    try {
      if (accessToken) {
        const countries = await fetchCountries(accessToken);
        setCountries(countries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, [accessToken]);

  //fetches states list for dropdown and pushesh it to setStates which is later mapped
  const handleCountry = async (event) => {
    try {
      setCurrentCountry(event.target.value);
      if (accessToken) {
        const states = await fetchStates(accessToken, event.target.value);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  //fetches cities list for dropdown and pushesh it to setCities which is later mapped
  const handleState = async (event) => {
    try {
      setCurrentState(event.target.value);
      if (accessToken) {
        const cities = await fetchCities(accessToken, event.target.value);
        setCities(cities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  //sets default country to India and fetches state list for India and is pushed to setStates
  const handleDefaultState = useCallback(async () => {
    try {
      if (currentCountry === "India" && accessToken) {
        const states = await fetchIndianStates(accessToken);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching Indian states:", error);
    }
  }, [accessToken, currentCountry]);

  //useeffect fetch request being called on componet mount
  useEffect(() => {
    if (accessToken) {
      fetchCountriesData();
      handleDefaultState();
    }
  }, [accessToken, fetchCountriesData, handleDefaultState]);

  //sets current city value in MUI select field onchange event
  const handleCities = async (event) => {
    setCurrentCity(event.target.value);
  };

  //mapping countries to MUI select input field
  const userOptionsCountry = useMemo(() => {
    return countries?.map((country) => ({
      label: country.country_name,
      value: country.country_name,
    }));
  }, [countries]);

  //mapping states to MUI select input field
  const userOptionsState = useMemo(() => {
    return states?.map((state) => ({
      label: state.state_name,
      value: state.state_name,
    }));
  }, [states]);

  //mapping cities to MUI select input field
  const userOptionsCities = useMemo(() => {
    return cities?.map((city) => ({
      label: city.city_name,
      value: city.city_name,
    }));
  }, [cities]);

  //handle form fields state update
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "user":
        setUserName(value);
        break;
      case "contactName":
        setContactName(value);
        break;
      case "quotation":
        setQuotation(value);
        break;
      case "mobileno":
        setPhone(value);
        break;
      case "type":
        setType(value);
        break;
      case "payment":
        setPayment(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "zipcode":
        setZipcode(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
        break;
    }
  };

  const handleDateChange = (date) => {
    setDeliveryDate(date);
  };
  console.log(tempId, userState);
  //get temporary user data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllTempUsers/${userId}`)
      .then((response) => {
        setUserData((prevData) => [...prevData, ...response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
    //get user data
    axios
      .get(apiUrl + `getAllUsersBasedOnType/${userId}`)
      .then((response) => {
        setUserData((prevData) => [...prevData, ...response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //get quotation data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllQuotations/${userId}`)
      .then((response) => {
        const filteredQuotations = response.data.filter(
          (item) =>
            item.status === "Delivered" &&
            item.category === "Purchase Quotation"
        );
        setAllQuotation(filteredQuotations);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //only show quotations that have status: delivered
  const approvedQuotation = allQuotation.map((item) => ({
    value: item.id,
    label: item.id,
  }));

  //format date
  const deliveryDateAntd = deliveryDate;
  const deliveryDateJS = deliveryDateAntd ? deliveryDateAntd.toDate() : null;
  const deliveryIST = deliveryDateJS;

  //handle delete row
  const handleRemoveRow = (idx) => () => {
    const updatedRows = rows.filter((_, index) => index !== idx);
    setRows(updatedRows);

    //calculate total everytime form is updated and saved
    const calculatedTotalAmount = updatedRows.reduce(
      (total, row) =>
        total +
        row.quantity * row.price +
        (row.quantity * row.price * row.cgst) / 100 +
        (row.quantity * row.price * row.igst) / 100 +
        (row.quantity * row.price * row.sgst) / 100,
      0
    );

    const calcTotalCgst = updatedRows.reduce(
      (total, row) => total + (row.quantity * row.price * row.cgst) / 100,

      0
    );
    const calcTotalIgst = updatedRows.reduce(
      (total, row) => total + (row.quantity * row.price * row.igst) / 100,

      0
    );
    const calcTotalSgst = updatedRows.reduce(
      (total, row) => total + (row.quantity * row.price * row.sgst) / 100,

      0
    );

    setTotalAmount(calculatedTotalAmount);
    setTotalCgst(calcTotalCgst);
    setTotalIgst(calcTotalIgst);
    setTotalSgst(calcTotalSgst);
  };

  //handle show hide popup form
  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
    setEditIndex(null);
    clearFormFields();
  };

  const handleModalClick = (event) => {
    if (event.target.classList.contains("modal")) {
      toggleForm();
    }
  };

  //handle popup submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (quantity && price && productName && description && weight && size) {
      const newRow = {
        product: { id: productId },
        productName,
        weight,
        inventory: null,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        description,
        createdBy: userId,
        size: size,
        cgst: parseFloat(cgst) || 0,
        sgst: parseFloat(sgst) || 0,
        igst: parseFloat(igst) || 0,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
      };

      let updatedRows;

      if (editIndex !== null) {
        updatedRows = [...rows];
        updatedRows[editIndex] = newRow;
        setRows(updatedRows);
      } else {
        updatedRows = [...rows, newRow];
        setRows(updatedRows);
      }

      clearFormFields();
      setShowForm(false);
      setEditIndex(null);

      //calculate total everytime form is updated and saved
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
          total +
          row.quantity * row.price +
          (row.quantity * row.price * row.cgst) / 100 +
          (row.quantity * row.price * row.igst) / 100 +
          (row.quantity * row.price * row.sgst) / 100,
        0
      );

      const calcTotalCgst = updatedRows.reduce(
        (total, row) => total + (row.quantity * row.price * row.cgst) / 100,

        0
      );
      const calcTotalIgst = updatedRows.reduce(
        (total, row) => total + (row.quantity * row.price * row.igst) / 100,

        0
      );
      const calcTotalSgst = updatedRows.reduce(
        (total, row) => total + (row.quantity * row.price * row.sgst) / 100,

        0
      );

      setTotalAmount(calculatedTotalAmount);
      setTotalCgst(calcTotalCgst);
      setTotalIgst(calcTotalIgst);
      setTotalSgst(calcTotalSgst);
    }
  };

  console.log(totalCgst, totalIgst);

  //handle editing of row
  const handleEditRow = (idx, row) => {
    setProductName(row.productName);
    setWeight(row.weight);
    setQuantity(row.quantity);
    setPrice(row.price);
    setCgst(row.cgst);
    setIgst(row.igst);
    setSgst(row.sgst);
    setSize(row.size);
    setDescription(row.description);
    setEditIndex(idx);
    setShowForm(true);
  };

  //clear popup field on save, close.
  const clearFormFields = () => {
    setProductName("");
    setWeight("");
    setQuantity("");
    setPrice("");
    setCgst("");
    setSize("");
    setIgst("");
    setSgst("");
    setDescription("");
  };

  //get all parts details
  useEffect(() => {
    axios
      .get(apiUrl + `getAllItem/${userId}`)
      .then((response) => {
        setUserData2(response.data);
        if (response.data.length > 0) {
          const loginUser = response.data[0].createdByUser.userName;
          const loginPhone = response.data[0].createdByUser.mobile;
          setSalesUser({ loginUser: loginUser, loginPhone: loginPhone });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //exclude productName. updatedRow is sent to API
  const updatedRows = rows.map(({ productName, ...rest }) => ({
    ...rest,
    comments: comment,
  }));

  //handle API post request
  const handleClick = async (event) => {
    let finalAmount = totalAmount.toFixed(2);
    event.preventDefault();

    if (contactName) {
      try {
        const response = await fetch(apiUrl + "createPurchaseOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchaseOrder: {
              ...(quotation && { quotid: quotation }),
              salesOrderId: null,
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
              paidamount: 0,
              createdDate: new Date(),
              lastModifiedDate: new Date(),
              comments: comment,
              termsAndCondition: terms,
              totalcgst: totalCgst,
              totalsgst: totalSgst,
              totaligst: totalIgst,
              totalAmount: finalAmount,
            },
            purchaseOrderDetails: updatedRows,

            //   salesOrder:{
            //     quotationId: quotation,
            //     userId: userId,
            //     contactPerson: salesUser.loginUser,
            //     contactPhone: salesUser.loginPhone,
            //     status: status,
            //     paymentMode:payment,
            //     type: type,
            //     deliveryDate: formattedDeliveryDate,
            //     lastModifiedByUser: {id: userId},
            //     deliveryAddress: address,
            //     city: null,
            //     state:null,
            //     country: null,
            //     createdBy: userId,
            //     createdDate: currentDate,
            //     lastModifiedDate: currentDate,
            //     comments : comment,
            //     termsAndCondition: terms,
            //     totalAmount: finalAmount,
            // },
            //     salesOrderDetails: updatedRows
          }),
        });

        if (response.ok) {
          response.json().then(async (data) => {
            let performaInvoiceData = null;
            let approvedInvoiceData = null;
            let deliveryChallanData = null;

            // Performa Invoice upload
            if (performaInvoiceFile) {
              const formData = new FormData();

              let jsonBodyData = {};

              let file = performaInvoiceFile;
              jsonBodyData.fileId = 0;
              jsonBodyData.fileName = "proforma_invoice";
              jsonBodyData.fileType = performaInvoiceFile?.type;
              jsonBodyData.referenceId = data.purchaseOrderRec?.id;
              jsonBodyData.referenceType = "PurchaseOrder";

              formData.append("file", file);
              formData.append("fileWrapper", JSON.stringify(jsonBodyData));

              try {
                const uploadResponse = await fetch(apiUrl + "upload", {
                  method: "POST",
                  body: formData,
                });

                if (uploadResponse.ok) {
                  const responseData = await uploadResponse.json();

                  performaInvoiceData = {
                    data: responseData,
                    file: performaInvoiceFile,
                  };
                } else {
                  console.error("Performa Invoice upload failed");
                }
              } catch (error) {
                console.error(error);
              }
            }

            // Approved Invoice upload
            if (approvedInvoiceFile) {
              const formData = new FormData();

              let jsonBodyData = {};

              let file = approvedInvoiceFile;
              jsonBodyData.fileId = 0;
              jsonBodyData.fileName = "approved_invoice";
              jsonBodyData.fileType = approvedInvoiceFile?.type;
              jsonBodyData.referenceId = data.purchaseOrderRec?.id;
              jsonBodyData.referenceType = "PurchaseOrder";

              formData.append("file", file);
              formData.append("fileWrapper", JSON.stringify(jsonBodyData));

              try {
                const uploadResponse = await fetch(apiUrl + "upload", {
                  method: "POST",
                  body: formData,
                });

                if (uploadResponse.ok) {
                  const responseData = await uploadResponse.json();

                  approvedInvoiceData = {
                    data: responseData,
                    file: approvedInvoiceFile,
                  };
                } else {
                  console.error("approved Invoice File upload failed");
                }
              } catch (error) {
                console.error(error);
              }
            }

            // Delivery Challan upload
            if (deliveryChallanFile) {
              const formData = new FormData();

              let jsonBodyData = {};

              let file = deliveryChallanFile;
              jsonBodyData.fileId = 0;
              jsonBodyData.fileName = "delivery_challan";
              jsonBodyData.fileType = deliveryChallanFile?.type;
              jsonBodyData.referenceId = data.purchaseOrderRec?.id;
              jsonBodyData.referenceType = "PurchaseOrder";

              formData.append("file", file);
              formData.append("fileWrapper", JSON.stringify(jsonBodyData));

              try {
                const uploadResponse = await fetch(apiUrl + "upload", {
                  method: "POST",
                  body: formData,
                });

                if (uploadResponse.ok) {
                  const responseData = await uploadResponse.json();

                  deliveryChallanData = {
                    data: responseData,
                    file: deliveryChallanFile,
                  };
                } else {
                  console.error("delivery Challan File upload failed");
                  return;
                }
              } catch (error) {
                console.error(error);
                return;
              }
            }

            if (
              performaInvoiceData ||
              approvedInvoiceData ||
              deliveryChallanData
            ) {
              navigate(
                `/dashboard/purchaseorder/viewDetail/${data?.purchaseOrderRec?.id}`,
                {
                  state: {
                    data: data,
                    performaInvoice: performaInvoiceData,
                    approvedInvoice: approvedInvoiceData,
                    deliveryChallan: deliveryChallanData,
                  },
                }
              );
            } else {
              navigate(
                `/dashboard/purchaseorder/viewDetail/${data?.purchaseOrderRec?.id}`,
                {
                  state: {
                    data: data,
                  },
                }
              );
            }
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  //set uploaded files to state
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

  //delete uploaded files from state
  const handleDeleteFile = (fileType) => {
    switch (fileType) {
      case "performaInvoice":
        setPerformaInvoiceFile(null);
        document.getElementById("performaInvoiceInput").value = "";
        break;
      case "approvedInvoice":
        setApprovedInvoiceFile(null);
        document.getElementById("approvedInvoiceInput").value = "";
        break;
      case "deliveryChallan":
        setDeliveryChallanFile(null);
        document.getElementById("deliveryChallanInput").value = "";
        break;
      default:
        break;
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
          <h2 style={{ margin: 0 }}>Create Purchase Order</h2>
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
                {" "}
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  required
                  value={type}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Mode"
                  name="payment"
                  required
                  value={payment}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="user"
                  required
                  select
                  value={userName}
                  onChange={(e) => {
                    const selectedOption = userData.find(
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
                    setUserName(e.target.value);
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
                  required
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
                  required
                  value={contactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile No."
                  name="mobileno"
                  required
                  value={phone}
                  type="number"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shipping Address"
                  required
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
                            required
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
                            required
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
                            required
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
                            type="number"
                            required
                            value={cgst}
                            onChange={(e) => {
                              setCgst(e.target.value);
                              setIgst(""); // Reset igst when cgst is changed
                            }}
                            disabled={igst !== "" && igst !== 0}
                            style={{ marginBottom: 16 }}
                          />
                        </Grid>
                      </div>
                      <div className="popup-right">
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            name="quantity"
                            required
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
                            required
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
                            required
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
                            required
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
                        required
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
                {rows.map((row, idx) => (
                  <TableRow hover key={idx}>
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
                      <IconButton onClick={handleRemoveRow(idx)}>
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
          Upload Documents In PDF Format:{" "}
        </label>
        <Box
          sx={{ mt: 2, mb: 2 }}
          display="flex"
          justifyContent="start"
          marginRight="12px"
        >
          <div>
            <div style={{ display: "inline-block" }}>
              <Button
                color="primary"
                variant="contained"
                align="right"
                onClick={() =>
                  document.getElementById("performaInvoiceInput").click()
                }
              >
                Performa Invoice
              </Button>
              {performaInvoiceFile && (
                <Button
                  color="secondary"
                  onClick={() => handleDeleteFile("performaInvoice")}
                  startIcon={<Delete />}
                  sx={{ color: "grey" }}
                >
                  Delete
                </Button>
              )}
            </div>
            <input
              type="file"
              id="performaInvoiceInput"
              onChange={handlePerformaInvoiceFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <div style={{ display: "inline-block" }}>
              <Button
                sx={{ ml: 2 }}
                color="primary"
                variant="contained"
                align="right"
                onClick={() =>
                  document.getElementById("approvedInvoiceInput").click()
                }
              >
                Approved Invoice
              </Button>
              {approvedInvoiceFile && (
                <Button
                  color="secondary"
                  onClick={() => handleDeleteFile("approvedInvoice")}
                  startIcon={<Delete />}
                  sx={{ color: "grey" }}
                >
                  Delete
                </Button>
              )}
            </div>
            <input
              type="file"
              id="approvedInvoiceInput"
              onChange={handleApprovedInvoiceFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <div style={{ display: "inline-block" }}>
              <Button
                sx={{ ml: 2 }}
                color="primary"
                variant="contained"
                align="right"
                onClick={() =>
                  document.getElementById("deliveryChallanInput").click()
                }
              >
                Delivery Challan
              </Button>
              {deliveryChallanFile && (
                <Button
                  color="secondary"
                  onClick={() => handleDeleteFile("deliveryChallan")}
                  startIcon={<Delete />}
                  sx={{ color: "grey" }}
                >
                  Delete
                </Button>
              )}
            </div>
            <input
              type="file"
              id="deliveryChallanInput"
              onChange={handleDeliveryChallanFileChange}
              style={{ display: "none" }}
            />
          </div>
        </Box>

        <Box
          sx={{ mt: 3, mb: 2 }}
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

PurchaseOrderCreateForm.propTypes = {
  customer: PropTypes.object.isRequired,
};
