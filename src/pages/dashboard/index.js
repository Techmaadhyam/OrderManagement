import { addDays, setSeconds, subDays, subHours, subMinutes } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { TotalInventoryCount } from 'src/sections/dashboard/overview/TotalInventoryCount';
import { OverviewSubscriptionUsage } from 'src/sections/dashboard/overview/overview-subscription-usage';
import { OverviewTask } from 'src/sections/dashboard/overview/OverviewTask';
import { OverviewAMC } from 'src/sections/dashboard/overview/OverviewAMC';
import { TotalWareHouseCount } from 'src/sections/dashboard/overview/TotalWareHouseCount';
import { TotalCost } from 'src/sections/dashboard/overview/TotalCost';
import { TotalPO } from 'src/sections/dashboard/overview/TotalPO';
import { TotalSO } from 'src/sections/dashboard/overview/TotalSO';
import { TotalQuotation } from 'src/sections/dashboard/overview/TotalQuotation';
import { SalesChart } from 'src/sections/dashboard/overview/salesChart';
import { PurchaseChart } from 'src/sections/dashboard/overview/PurchaseChart';
import { QuotationChart } from 'src/sections/dashboard/overview/QuotationChart';
import { WarehouseList } from 'src/sections/dashboard/overview/WarehouseList';
import { InventoryList } from 'src/sections/dashboard/overview/InventoryList';
import { Balance } from 'src/sections/dashboard/overview/Balance';
import IconWithPopup from '../../sections/dashboard/user/user-icon';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from 'src/config';
import Logo from 'src/sections/dashboard/logo/logo';




const userId = parseInt(sessionStorage.getItem('user')|| localStorage.getItem('user'))

const now = new Date();

const Page = () => {
  // const [inventoryCount, setInventoryCount] = useState(0);
  // const [wareHouseCount, setWarehouseCount] = useState(0);
  // const [total, setTotal] = useState(0);
  // const [so, setSo] = useState(0);
  // const [po, setPo] = useState(0);
  // const [quotation, setQuotation] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasks2, setTasks2] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const settings = useSettings();

  usePageView();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response1 = await axios.get(apiUrl + `getInventoryCount/${userId}`);
  //       setInventoryCount(response1.data);
  
  //       const response2 = await axios.get(apiUrl + `getWarehouseCount/${userId}`);
  //       setWarehouseCount(response2.data);

  //       const response3 = await axios.get(apiUrl + `getTotalCost/${userId}`);
  //       setTotal(response3.data);

  //       const response4 = await axios.get(apiUrl + `getSalesOrderBasedOnStatus/${userId}/Open`);
  //       setSo(response4.data);

  //       const response5 = await axios.get(apiUrl + `getPurchaseOrderBasedOnStatus/${userId}/Open`);
  //       setPo(response5.data);

  //       const response6 = await axios.get(apiUrl + `getQuotationBasedOnStatus/${userId}/Open`);
  //       setQuotation(response6.data);
  
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const response = await axios.get(apiUrl + `getAllTodaysTask/${userId}`);
  
  
        let combinedList = [
          ...response.data.poList.map(obj => ({ ...obj, category: "poList" })),
          ...response.data.soList.map(obj => ({ ...obj, category: "soList" }))
        ];

        let combinedList2 =[
          ...response.data.woList.map(obj => ({ ...obj, category: "woList" }))
        ];
 
  
        setTasks(combinedList);
        setTasks2(combinedList2)
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchData();
  }, []);

  //get warehouse data
  useEffect(() => {
    axios.get(apiUrl +`getAllWareHouse/${userId}`)
      .then(response => {
        setWarehouseData(response.data);

      })
      .catch(error => {
        console.error(error);
      });
  }, []);

    useEffect(() => {
      axios
        .get(apiUrl + `getInventoryByUserId/${userId}`)
        .then((response) => {
           setInventoryData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  


  return (
    <>
      <Seo title="Dashboard: Overview" />
      <Box
        component="main"
        sx={{
          backgroundColor: "#F3F4F6",
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid
            container
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4,
            }}
            sx={{ mb: 4 }}
          >
            <Grid xs={12} sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <div style={{ flex: 1 }}>
                  <Typography variant="h4">Overview</Typography>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <Logo />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Stack direction="row" spacing={4}>
                    <IconWithPopup />
                  </Stack>
                </div>
              </Stack>
            </Grid>
            {/* <Grid xs={12} md={4}>
              <TotalInventoryCount amount={38384} />
            </Grid>
            <Grid xs={12} md={4}>
              <TotalWareHouseCount amount={435354} />
            </Grid>
            <Grid xs={12} md={4}>
              <TotalCost amount={(232434).toLocaleString("en-IN")} />
            </Grid>
            <Grid xs={12} md={4}>
              <TotalQuotation amount={44343} />
            </Grid>
            <Grid xs={12} md={4}>
              <TotalSO amount={44} />
            </Grid>
            <Grid xs={12} md={4}>
              <TotalPO amount={35434} />
            </Grid> */}

            {/* <Grid xs={12} md={12}>
              <OverviewSubscriptionUsage
                chartSeries={[
                  {
                    name: "This Month",
                    data: [40, 37, 41, 42, 45],
                  },
               
                ]}
              />
            </Grid> */}
            <Grid xs={12} md={6}>
              <SalesChart />
            </Grid>
            <Grid xs={12} md={6}>
              <PurchaseChart />
            </Grid>
            <Grid xs={12} md={12}>
              <QuotationChart />
            </Grid>
            <Grid xs={12} md={12}>
              <Balance  />
            </Grid>
            <Grid xs={12} md={6}>
              <WarehouseList messages={warehouseData} />
            </Grid>
            <Grid xs={12} md={6}>
              <InventoryList messages={inventoryData} />
            </Grid>
            <Grid xs={12} md={6}>
              <OverviewAMC messages={tasks2} />
            </Grid>
            <Grid xs={12} md={6}>
              <OverviewTask messages={tasks} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
