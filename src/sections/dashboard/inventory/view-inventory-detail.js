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

const userId = sessionStorage.getItem('user') || localStorage.getItem('user');


export const ViewInventoryDetail = (props) => {

  const location = useLocation();
  const state = location.state;
  const [userData, setUserData]= useState([])

  console.log(state)



  const align = 'horizontal' 

  useEffect(() => {
    axios.get(apiUrl +`getInventoryByUserId/${userId}`)
      .then(response => {
        setUserData(response.data);
    
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  console.log(userData);

  const matchingObject = userData.find(item => item.inventoryId === state?.id);
  const warehouseName = matchingObject?.warehouseName;
  const productName = matchingObject?.productName;

 
  return (
    <div style={{minWidth: "100%", marginTop: "1rem" ,marginBottom: "1rem"  }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link
          color="text.primary"
          component={RouterLink}
          href={paths.dashboard.inventory.view}
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
          underline="none"
        >
          <SvgIcon sx={{ mr: 1, width: 38, height: 38,  transition: 'color 0.5s','&:hover': { color: `${primaryColor}` }}}>
            <ArrowCircleLeftOutlinedIcon/>
          </SvgIcon>
          <Typography variant="subtitle2">
             Back To <span style={{color: `${primaryColor}` , fontWeight: 600}}>Inventory List</span> 
          </Typography>
        </Link>
        <IconWithPopup/>
      </div>
 <h2>Inventory</h2>
 <Card>
        <CardHeader title="Inventory Detail" />
        <CardContent sx={{ pt: 0 , mt: 5}}>
          <Grid
            container
            spacing={3}
          >
            <Grid
            item
              xs={12}
              md={6}
            >
                    <PropertyListItem
          align={align}
          label="Warehouse"
          value={state?.warehouseName || warehouseName}
        />     <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
             <PropertyListItem
          align={align}
          label="Purchase Order"
          value={String(state?.purchaseOrderId)}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
            <PropertyListItem
          align={align}
          label="Model"
          value={state?.categoryName ||state?.category?.name}
        />
         <Divider />
            </Grid>
            
            <Grid
            item
              xs={12}
              md={6}
            >
                     <PropertyListItem
          align={align}
          label="Rack"
          value={state?.rackName || state?.rack?.name}
        />
        <Divider />
            </Grid>
           
        <Grid
        item
              xs={12}
              md={6}
            >
           <PropertyListItem
          align={align}
          label="Part Name"
          value={state?.productName || productName}
        />
         <Divider />
          </Grid>
          <Grid
          item
              xs={12}
              md={6}
            >
        <PropertyListItem
          align={align}
          label="HSN Code"
          value={state?.hsncode}
        />
        <Divider />
          </Grid>
  
    
            <Grid
            item
              xs={12}
              md={6}
            >
              <PropertyListItem
          align={align}
          label="Size"
          value={state?.size}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
             <PropertyListItem
          align={align}
          label="Weight"
          value={state?.weight}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
                <PropertyListItem
          align={align}
          label="Available Stock"
          value={String(state?.quantity)}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
               <PropertyListItem
          align={align}
          label="CGST"
          value={String(state?.cgst)}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
              <PropertyListItem
          align={align}
          label="IGST"
          value={String(state?.igst)}
        />
         <Divider />
            </Grid>
            <Grid
            item
              xs={12}
              md={6}
            >
        <PropertyListItem
          align={align}
          label="SGST"
          value={String(state?.sgst)}
        />
         <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
            >
              <PropertyListItem
          align={align}
          label="Description"
          value={state?.description}
        />
            </Grid>
          </Grid>
         
        </CardContent>
        <Divider/>
      </Card>
    </div>
  );
};

ViewInventoryDetail.propTypes = {
  customer: PropTypes.object.isRequired
};