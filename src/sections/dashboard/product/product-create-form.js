import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import IconWithPopup from "../user/user-icon";
import { useState } from "react";
import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import { ToastContainer, toast } from "react-toastify";
import { LogoContext } from "src/utils/logoContext";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

export const CreateProduct = (props) => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  // const [type, setType]= useState('Parts')
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState([]);
  const [partNumber, setpartNumber] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [cgst, setCgst] = useState("");
  const [categoryName, setCategoryName] = useState("");

  //change label based on company name
  const { logo } = useContext(LogoContext);
  const modifyLabel = logo?.company === "Alumentica";

  //handle category change
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    // console.log(selectedCategory);
    let categoryName = selectedCategory.split("#")[0];
    setCategoryName(categoryName);
    setCategory(selectedCategory);

    if (
      selectedCategory &&
      // selectedCategory !== "none" &&
      selectedCategory === "Add New Model"
      // isNaN(Number(selectedCategory))
    ) {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
    }
  };

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

  //  get date
  useEffect(() => {
    const today = new Date();
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-ZA", options);
    setCurrentDate(formattedDate);
  }, []);

  //get category using userid
  useEffect(() => {
    axios
      .get(apiUrl + `getAllCategorys/${userId}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  //concat useroptions with new data from above API GET request
  const userOptions = [
    {
      label: "None",
      value: "none",
    },
    {
      label: modifyLabel ? "Add New Model Description" : "Add New Model",
      value: "Add New Model",
    },
    // {
    //   label: 'ETON STD 2002',
    //   value: 'ETON STD 2002'
    // },
    // {
    //   label: 'ETON BASIC 2002',
    //   value: 'ETON BASIC 2002'
    // },
    // {
    //   label: 'ETON 5000 APPAREL STD',
    //   value: 'ETON 5000 APPAREL STD'
    // },
    // {
    //   label: 'ETON 5000 ADVANCE SYNCRO',
    //   value: 'ETON 5000 ADVANCE SYNCRO'
    // },
    // {
    //   label: 'ETON 4000',
    //   value: 'ETON 4000'
    // },
  ];

  // const typeDropdown = [
  //   {
  //     label: 'Parts',
  //     value: 'Parts'
  //   },
  //   {
  //     label: 'Spare Parts',
  //     value: 'Spare Parts'
  //   },

  // ];

  const mappedOptions = data.map(({ id, name, description }) => ({
    label: `${name} ${description}`,
    value: `${name} ${description}#${id}`,
  }));

  const updatedUserOptions = userOptions.concat(mappedOptions);

  //handle user inputs
  const handleProduct = (event) => {
    setProduct(event.target.value);
  };
  const handleNewCategory = (event) => {
    setNewCategory(event.target.value);
  };
  // const handleType = (event) => {
  //   setType(event.target.value);
  // };
  const handleDescription1 = (event) => {
    setDesc1(event.target.value);
  };
  const handleDescription2 = (event) => {
    setDesc2(event.target.value);
  };
  const handlePart = (event) => {
    setpartNumber(event.target.value);
  };
  //for sending response body via route
  const navigate = useNavigate();
  //handle save
  let requestBody;

  const handleSave = () => {
    // debugger;

    if (
      showAdditionalFields &&
      product &&
      partNumber &&
      (desc2 || desc1) &&
      userId &&
      ((sgst && cgst) || igst) &&
      newCategory &&
      desc1
    ) {
      requestBody = {
        product: {
          productName: product,
          //type: type,
          partnumber: partNumber,
          description: desc2,
          createdBy: parseFloat(userId),
          createdDate: new Date(),
          lastModifiedDate: new Date(),
          lastModifiedByUser: { id: parseFloat(userId) },
          sgst: parseFloat(sgst) || 0,
          cgst: parseFloat(cgst) || 0,
          igst: parseFloat(igst) || 0,
        },
        category: {
          name: newCategory,
          description: desc1,
          createdBy: parseFloat(userId),
          createdDate: new Date(),
        },
      };
    } else if (
      showAdditionalFields === false &&
      product &&
      // desc2 &&
      userId &&
      category &&
      ((sgst && cgst) || igst) &&
      partNumber
    ) {
      let categoryId = category.split("#")[1];

      console.log(categoryId);
      requestBody = {
        product: {
          productName: product,
          partnumber: partNumber,
          //type: type,
          description: desc2,
          createdBy: parseFloat(userId),
          createdDate: new Date(),
          lastModifiedDate: new Date(),
          lastModifiedByUser: { id: parseFloat(userId) },
          sgst: parseFloat(sgst) || 0,
          cgst: parseFloat(cgst) || 0,
          igst: parseFloat(igst) || 0,
        },
        category: {
          id: categoryId,
        },
      };
    } else {
      notify("error", "Please fill all the fields marked with *.");

    }


    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios
      .post(apiUrl + "addProduct", JSON.stringify(requestBody), config)
      .then((response) => {
        // Handle successful response
        console.log(response.data);
        if (response.status === 200) {
          //navigate to view product details (using react router)
          navigate(`/dashboard/products/viewDetail/${response.data.id}`, {
            state: response.data,
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <div style={{ minWidth: "100%", marginBottom: "1rem" }}>
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
          <h2 style={{ margin: 0 }}>Add Parts / Products</h2>
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
          <CardHeader title="Part Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              {" "}
              {/*<Grid
          xs={12}
          md={6}
        >
          <TextField
        
                fullWidth
                label="Type"
                name="type"
                select
                value={type}
                onChange={handleType} 
            >
               {typeDropdown.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
               </Grid>*/}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={modifyLabel ? "Model Description" : "Model"}
                  name="category"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={category}
                  onChange={(event) => {
                    handleCategoryChange(event);
                  }}
                >
                  {updatedUserOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {showAdditionalFields && (
                <>
                  <Grid />
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={
                        modifyLabel
                          ? "Add New Model Description"
                          : "Add New Model"
                      }
                      name="new category"
                      required
                      value={newCategory}
                      onChange={handleNewCategory}
                    ></TextField>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={
                        modifyLabel
                          ? "Model Cutting Length"
                          : "Model Description"
                      }
                      name="description"
                      required
                      value={desc1}
                      onChange={handleDescription1}
                      multiline
                    />
                  </Grid>
                </>
              )}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={modifyLabel ? "Model Weight Range" : "Part Name"}
                  name="name"
                  required
                  value={product}
                  onChange={handleProduct}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={modifyLabel ? "Finish Model" : "Part Number"}
                  name="partNumber"
                  required
                  value={partNumber}
                  onChange={handlePart}
                ></TextField>
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
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IGST"
                  name="igst"
                  type="number"
                  // required
                  value={igst}
                  onChange={(e) => {
                    setIgst(e.target.value);
                    setSgst(""); // Reset sgst when igst is changed
                    setCgst(""); // Reset cgst when igst is changed
                  }}
                  disabled={
                    (cgst !== "" && cgst !== 0) || (sgst !== "" && sgst !== 0)
                  }
                />
              </Grid>
            </Grid>
            {
              modifyLabel ? (
                <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    // required
                    rows={4}
                    value={
                      category === "Add New Model"
                        ? `${newCategory} ${desc1} ${product}`
                        : category === "none" ? "" :
                          `${categoryName} ${product}`
                    }
                    onChange={handleDescription2}
                  />
                </Grid>
              ) : (
                <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    required
                    rows={4}
                    value={category === "Add New Model"
                      ? `${newCategory} ${desc1} ${product}`
                      : category === "none" ? "" :
                        `${categoryName} ${product}`}
                    onChange={handleDescription2}
                  />
                </Grid>
              )

            }
          </CardContent>
          <Divider />
        </Card>
      </form>
      <Grid xs={12} md={6}>
        <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            align="right"
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

CreateProduct.propTypes = {
  customer: PropTypes.object.isRequired,
};
