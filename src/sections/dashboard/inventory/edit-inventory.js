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
import "./inventory.css";
import { Box } from "@mui/system";
import IconWithPopup from "../user/user-icon";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";

//get user id

const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

//default rack
const userOptions = [
  {
    label: "Add New Rack",
    value: "others",
  },
];

export const EditInventory = (props) => {
  //get data from useNavigate hook in view table page when clicking on edit icon
  const location = useLocation();
  const state = location.state;

  //show/ hides additional rack fields
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  //warehouse
  const [warehouse, setWarehouse] = useState();
  const [warehouseId, setWarehouseId] = useState();
  //purchase order
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [purchaseId, setPurchaseId] = useState();
  //category
  const [category, setCategory] = useState();
  const [categoryId, setCategoryId] = useState();

  //product name
  const [selectedName, setSelectedName] = useState();
  const [selectedId, setSelectedId] = useState();
  const [product, setProduct] = useState([]);
  //other form input states
  const [hsnCode, setHsnCode] = useState(state.hsncode || "");
  const [size, setSize] = useState(state.size || "");
  const [rack, setRack] = useState(state.rack?.id || "");
  const [weight, setWeight] = useState(state.weight || "");
  const [quantity, setQuantity] = useState(state.quantity || "");
  const [cost, setCost] = useState(state.price || "");
  const [sgst, setSgst] = useState(state.sgst || "");
  const [igst, setIgst] = useState(state.igst || "");
  const [cgst, setCgst] = useState(state.cgst || "");
  const [description, setDescription] = useState(state.description || "");
  const [rackName, setRackName] = useState(state.rack?.name || "");
  const [rackDesc, setRackDesc] = useState("");

  //inventory data from API is stored here
  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();

  //get warehouse data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllWareHouse/${userId}`)
      .then((response) => {
        setWarehouse(response.data);

        const selectedWarehouseId = response.data.find(
          (option) => option.id === state?.warehouse?.id
        );
        const selectedWarehouse = selectedWarehouseId
          ? selectedWarehouseId.id
          : "";
        setWarehouseId(selectedWarehouse);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.warehouseId]);
  //get purchase order data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllPurchaseOrderByUser/${userId}`)
      .then((response) => {
        setPurchaseOrder(response.data);

        const selectedPurchaseId = response.data.find(
          (option) => option.id === state?.purchaseOrderId
        );
        const selectedPurchase = selectedPurchaseId
          ? selectedPurchaseId.id
          : "";
        setPurchaseId(selectedPurchase);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.purchaseOrderId]);
  //get category data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllCategorys/${userId}`)
      .then((response) => {
        setCategory(response.data);
        console.log(response.data);

        const selectedPurchaseId = response.data.find(
          (option) => option.id === state?.category.id
        );
        const selectedPurchase = selectedPurchaseId
          ? selectedPurchaseId.id
          : "";
        setCategoryId(selectedPurchase);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.category.id]);

  //get Product data
  useEffect(() => {
    axios
      .get(apiUrl + `getAllItem/${userId}`)
      .then((response) => {
        setProduct(response.data);
        console.log(response.data);

        const selectedPurchaseId = response.data.find(
          (option) => option.id === state?.product.id
        );
        const selectedPurchase = selectedPurchaseId
          ? selectedPurchaseId.id
          : "";
        setSelectedId(selectedPurchase);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state?.product.id]);

  //get inventory data
  useEffect(() => {
    axios
      .get(apiUrl + `getInventoryByUserId/${userId}`)
      .then((response) => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //update edited form input state
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "hsncode":
        setHsnCode(value);
        break;
      case "rack":
        setRack(value);
        break;
      case "size":
        setSize(value);
        break;
      case "weight":
        setWeight(value);
        break;
      case "quantity":
        setQuantity(value);
        break;
      case "cost":
        setCost(value);
        break;
      case "cgst":
        setCgst(value);
        break;
      case "sgst":
        setSgst(value);
        break;
      case "igst":
        setIgst(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  //handle rack change
  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;

    setRack(selectedValue);
    // Check if the selected rack is not empty, not "none", not "other", and not a number.
    if (
      selectedValue &&
      selectedValue !== "none" &&
      selectedValue !== "other" &&
      isNaN(Number(selectedValue))
    ) {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
    }
  };

  // This function handles changes in the "rack" name input element
  const handleRack = (event) => {
    setRackName(event.target.value);
  };
  // This function handles changes in the "rack" description input element
  const handleRackDesc = (event) => {
    setRackDesc(event.target.value);
  };
  // Filter out user data where the "rack" property is not null
  const filteredUserData = userData.filter(({ rack }) => rack !== null);
  // Map the filtered user data to an array of options with label and value properties
  const mappedOptions = filteredUserData.map(({ rack }) => ({
    label: rack?.name,
    value: rack?.id,
  }));
  // Create a Set to store unique "rack" IDs
  const rackIdSet = new Set();
  /*Concatenate the userOptions array with the new mappedOptions array, 
  filtering out duplicates based on "rack" IDs*/
  const updatedUserOptions = userOptions.concat(
    mappedOptions.filter((newOption) => {
      if (rackIdSet.has(newOption.value)) {
        /*Skip adding the new option if its "rack" ID 
        is already in the rackIdSet (i.e., it's a duplicate) */
        return false;
      } else {
        rackIdSet.add(newOption.value);
        /*Add the "rack" ID to the rackIdSet to avoid duplicates in the future */
        return true;
      }
    })
  );
  //submit form
  const handleSave = async () => {
    let inventory = {
      inventory: {
        id: state?.id,
        quantity: parseFloat(quantity),
        weight: weight,
        size: size,
        hsncode: hsnCode,
        price: parseFloat(cost),
        description: description,
        createdBy: parseFloat(userId),
        product: { id: selectedId },
        purchaseOrderId: purchaseId,
        sgst: parseFloat(sgst) || 0,
        cgst: parseFloat(cgst) || 0,
        igst: parseFloat(igst) || 0,
        lastModifiedByUser: { id: userId },
      },
      warehouse: {
        id: warehouseId,
      },

      rack: {
        name: rackName,
        description: rackDesc,
        createdBy: parseFloat(userId),
      },

      category: {
        id: categoryId,
      },
    };

    let inventoryWithRack = {
      inventory: {
        quantity: parseFloat(quantity),
        id: state?.id,
        weight: weight,
        size: size,
        hsncode: hsnCode,
        price: parseFloat(cost),
        description: description,
        createdBy: parseFloat(userId),
        product: { id: selectedId },
        purchaseOrderId: purchaseId,
        sgst: parseFloat(sgst) || 0,
        cgst: parseFloat(cgst) || 0,
        igst: parseFloat(igst) || 0,
        lastModifiedByUser: { id: userId },
      },

      warehouse: {
        id: warehouseId,
      },
      rack: rack ? { id: rack } : { id: -1 },

      category: {
        id: categoryId,
      },
    };
    console.log(JSON.stringify(inventory));

    if (
      showAdditionalFields &&
      warehouseId &&
      quantity &&
      weight &&
      hsnCode &&
      rack &&
      cost &&
      description &&
      userId
    ) {
      try {
        const response = await fetch(apiUrl + "addInventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inventory),
        });

        if (response.ok) {
          // Redirect to inventory page upon successful submission

          response.json().then((data) => {
            console.log(data);
            navigate(`/dashboard/inventory/viewDetail/${state?.id}`, {
              state: data,
            });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    } else if (showAdditionalFields === false) {
      try {
        const response = await fetch(apiUrl + "addInventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inventoryWithRack),
        });

        if (response.ok) {
          // Redirect to inventory page upon successful submission

          response.json().then((data) => {
            console.log(data);
            navigate(`/dashboard/inventory/viewDetail/${state?.inventoryId}`, {
              state: data,
            });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
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
          <h2 style={{ margin: 0 }}>Edit Inventory</h2>
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
          <CardHeader title="Inventory Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warehouse"
                  name="warehouse"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={warehouseId ? warehouseId : ""}
                  onChange={(e) => {
                    const selectedOption = warehouse?.find(
                      (option) => option.id === e.target.value
                    );
                    setWarehouseId(selectedOption?.id || "");
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {warehouse?.map(
                    (option) =>
                      option.id && (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                  )}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Order"
                  name="purchaseorder"
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={purchaseId ? purchaseId : ""}
                  onChange={(e) => {
                    const selectedOption = purchaseOrder?.find(
                      (option) => option.id === e.target.value
                    );
                    setPurchaseId(selectedOption?.id || "");
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {purchaseOrder?.map(
                    (option) =>
                      option.id && (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id}
                        </MenuItem>
                      )
                  )}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
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
                  value={categoryId ? categoryId : ""}
                  onChange={(e) => {
                    const selectedOption = category?.find(
                      (option) => option.id === e.target.value
                    );
                    setCategoryId(selectedOption?.id || "");
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {category?.map(
                    (option) =>
                      option.id && (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                  )}
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Part Name"
                  name="product"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={selectedId ? selectedId : ""}
                  onChange={(e) => {
                    const selectedProductId = e.target.value;
                    const selectedOption = product.find(
                      (option) => option.id === selectedProductId
                    );

                    if (selectedOption) {
                      setSelectedId(selectedOption.id);
                      setSelectedName(selectedOption.productName);
                      setCgst(selectedOption.cgst);
                      setIgst(selectedOption.igst);
                      setSgst(selectedOption.sgst);
                    } else {
                      setSelectedId(null);
                      setSelectedName("");
                    }
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {product
                    .filter((option) => option.category.id === categoryId)
                    .map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.productName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rack"
                  name="rack"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={rack}
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
                      label="New Rack Name"
                      name="rack name"
                      required
                      value={rackName}
                      onChange={handleRack}
                    ></TextField>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      required
                      value={rackDesc}
                      onChange={handleRackDesc}
                      multiline
                    />
                  </Grid>
                </>
              )}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="HSN Code"
                  name="hsncode"
                  required
                  value={hsnCode}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Size"
                  name="size"
                  value={size}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  required
                  name="weight"
                  value={weight}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  required
                  value={quantity}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  name="cost"
                  type="number"
                  required
                  value={cost}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CGST"
                  type="number"
                  required
                  name="cgst"
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
                  type="number"
                  required
                  name="sgst"
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
                  required
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
            <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                required
                rows={4}
                maxRows={6}
                value={description}
                onChange={handleInputChange}
              />
            </Grid>
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

EditInventory.propTypes = {
  customer: PropTypes.object.isRequired,
};
