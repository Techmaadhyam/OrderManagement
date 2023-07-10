import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  Divider,
  Card,
  CardHeader,
  Typography,
} from '@mui/material';

import { socialApi } from 'src/api/social';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import axios from 'axios';
import { apiUrl } from 'src/config';


const mail = sessionStorage.getItem("mail");

export const Page = () => {
 
  const [userData, setUserData] = useState();




  
  useEffect(() => {
    axios
      .get(apiUrl + `getUserByUsername/${mail}`)
      .then((response) => {
        setUserData(response.data.loggedIUser[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

//logout
const handleLogout = () => {
  // Clear the session storage
  sessionStorage.clear();
  localStorage.removeItem('accessToken');
  const broadcastChannel = new BroadcastChannel('logoutChannel');
  broadcastChannel.postMessage('logout');
  window.location.href = paths.index;
};

  const align = 'horizontal' 

  return (
    <>
      <Seo title="Dashboard: Social Profile" />
      <CardHeader
        title="Your Profile Details"
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button color="primary" variant="contained" onClick={handleLogout}>
            Log Out
          </Button>
        }
      />

      <Card sx={{ m: 3, mt: 2 }}>
        <PropertyList>
          <PropertyListItem align={align} label="First Name">
            <Typography variant="subtitle2">{userData?.firstName}</Typography>
          </PropertyListItem>
          <Divider />
          <PropertyListItem
            align={align}
            label="Last Name"
            value={userData?.lastName}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Email"
            value={userData?.userName}
          />
          <Divider />
          <PropertyListItem align={align} label="Phone" value={userData?.mobile} />
          <Divider />
          <PropertyListItem
            align={align}
            label="Company"
            value={userData?.companyName}
          />
          <Divider />
          <PropertyListItem align={align} label="Type" value={userData?.type} />
          <Divider />
          <PropertyListItem
            align={align}
            label="Address"
            value={
              userData?.address +
              ", " +
              userData?.city +
              ", " +
              userData?.userData +
              ", " +
              userData?.country
            }
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="ZipCode"
            value={userData?.pincode}
          ></PropertyListItem>
        </PropertyList>
        <Divider />
      </Card>
    </>
  );
};

export default Page;