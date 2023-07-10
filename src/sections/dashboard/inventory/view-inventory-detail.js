import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  Typography,
  Link,
  SvgIcon,
  Grid,
  CardContent
} from '@mui/material';

import { PropertyListItem } from 'src/components/property-list-item';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { primaryColor } from 'src/primaryColor';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import IconWithPopup from '../user/user-icon';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from 'src/config';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo/logo';

const userId = sessionStorage.getItem('user') || localStorage.getItem('user');


export const ViewInventoryDetail = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [userData, setUserData] = useState([])


  console.log(state)



  const align = 'horizontal'

  useEffect(() => {
    axios.get(apiUrl + `getInventoryByUserId/${userId}`)
      .then(response => {
        setUserData(response.data);
        console.log(response.data)
    
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const matchingObject = userData.find(item => item.id === state?.id || state?.inventoryId );
  const warehouseName = matchingObject?.warehouseName;
  const productName = matchingObject?.product?.productName;

  console.log(matchingObject)


  const handleWarehouseNavigation = () => {

    axios
    .get(apiUrl + `getAllWareHouse/${userId}`)
    .then(response => {
      const matchedData = response.data.filter(obj => obj.id === state?.warehouseId  );

      if (matchedData.length > 0) {
        navigate(`/dashboard/invoices/viewDetail`, { state: matchedData[0] });
      } else {
        console.log('No matching data found.');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  const handleProductNavigation = () => {

    axios
    .get(apiUrl +`getAllItem/${userId}`)
    .then(response => {
      const matchedData = response.data.filter(obj => {

  return obj.id === state?.product?.id || obj.id === state?.productId;
});
      if (matchedData.length > 0) {
        navigate(`/dashboard/products/viewDetail/${matchedData[0].id}`, { state: matchedData[0] });
      } else {
        console.log('No matching data found.');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };



 
  return (
    <div style={{ minWidth: "100%", marginTop: "1rem", marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.inventory.view}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="none"
          >
            <SvgIcon
              sx={{
                mr: 1,
                width: 38,
                height: 38,
                transition: "color 0.5s",
                "&:hover": { color: `${primaryColor}` },
              }}
            >
              <ArrowCircleLeftOutlinedIcon />
            </SvgIcon>
            <Typography variant="subtitle2">
              Back To{" "}
              <span style={{ color: `${primaryColor}`, fontWeight: 600 }}>
                Inventory List
              </span>
            </Typography>
          </Link>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <h2>Inventory</h2>
      <Card>
        <CardHeader title="Inventory Detail" />
        <CardContent sx={{ pt: 0, mt: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PropertyListItem align={align} label="Warehouse">
                <Link
                  color="primary"
                  onClick={handleWarehouseNavigation}
                  style={{ cursor: "pointer" }}
                >
                  <Typography variant="subtitle2">
                    {state?.warehouseName || warehouseName}
                  </Typography>
                </Link>
              </PropertyListItem>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Purchase Order"
                value={String(
                  state?.purchaseOrderId || matchingObject?.purchaseOrderId
                )}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Model"
                value={
                  state?.categoryName ||
                  state?.category?.name ||
                  matchingObject?.category.name
                }
              />
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Rack"
                value={
                  state?.rackName ||
                  state?.rack?.name ||
                  matchingObject?.rack.name
                }
              />
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <PropertyListItem align={align} label="Part Name">
                <Link
                  color="primary"
                  onClick={handleProductNavigation}
                  style={{ cursor: "pointer" }}
                >
                  <Typography variant="subtitle2">
                    {state?.productName || productName || state?.product?.productName}
                  </Typography>
                </Link>
              </PropertyListItem>
              <Divider />
            </Grid>
            <Divider />
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="HSN Code"
                value={state?.hsncode || matchingObject?.hsncode}
              />
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Size"
                value={state?.size}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Weight"
                value={state?.weight}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Available Stock"
                value={String(state?.quantity)}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="CGST"
                value={String(state?.cgst)}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="IGST"
                value={String(state?.igst)}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="SGST"
                value={String(state?.sgst)}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <PropertyListItem
                align={align}
                label="Description"
                value={state?.description}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </div>
  );
};

ViewInventoryDetail.propTypes = {
  customer: PropTypes.object.isRequired
};