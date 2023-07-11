import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Box,
  Button,
  Divider,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";

import { socialApi } from "src/api/social";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useContext } from "react";
import { LogoContext } from "src/utils/logoContext";

export const Page = () => {
  const { logo } = useContext(LogoContext);

  //logout
  const handleLogout = () => {
    // Clear the session storage
    sessionStorage.clear();
    localStorage.removeItem("accessToken");
    const broadcastChannel = new BroadcastChannel("logoutChannel");
    broadcastChannel.postMessage("logout");
    window.location.href = paths.index;
  };

  const align = "horizontal";

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
            <Typography variant="subtitle2">{logo?.firstName}</Typography>
          </PropertyListItem>
          <Divider />
          <PropertyListItem
            align={align}
            label="Last Name"
            value={logo?.lastName}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Email"
            value={logo?.userName}
          />
          <Divider />
          <PropertyListItem align={align} label="Phone" value={logo?.mobile} />
          <Divider />
          <PropertyListItem
            align={align}
            label="Company"
            value={logo?.company}
          />
          <Divider />
          <PropertyListItem align={align} label="Type" value={logo?.type} />
          <Divider />
          <PropertyListItem
            align={align}
            label="Address"
            value={
              logo?.address +
              ", " +
              logo?.city +
              ", " +
              logo?.state +
              ", " +
              logo?.country
            }
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="ZipCode"
            value={logo?.pincode}
          ></PropertyListItem>
        </PropertyList>
        <Divider />
      </Card>
    </>
  );
};

export default Page;
