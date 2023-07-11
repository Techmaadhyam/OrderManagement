import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  Typography,
  Link,
  SvgIcon,
} from '@mui/material';
import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { primaryColor } from 'src/primaryColor';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import IconWithPopup from '../user/user-icon';
import { useLocation } from 'react-router-dom';
import {  Box } from '@mui/system';
import { Scrollbar } from 'src/components/scrollbar';
import { Table } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiUrl } from 'src/config';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo/logo';



export const ViewWarehouseDetail = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  console.log(state)
  const [rowData, setRowData] =useState()

  const columns = [
    {
      title: 'Part Name',
      dataIndex: 'product',
      key: 'product',
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/inventory/viewDetail/${record.id}`, { state: record } );
        };
        
        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: 'center',

            }}
            underline="hover"
          >
            <Typography variant="subtitle2">{name.productName}</Typography>
          </Link>
        );
      },
    },
    
    {
      title: 'Rack',
      dataIndex: "rack",
      key: 'rack',
      render: (text)=>text.name
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    
    {
      title: 'Cost',
      key: 'price',
      dataIndex: 'price',
    },
      {
        title: 'CGST',
        key: 'cgst',
        dataIndex: 'cgst',
      },
      {
        title: 'SGST',
        key: 'sgst',
        dataIndex: 'sgst',
      },
      {
        title: 'IGST',
        key: 'igst',
        dataIndex: 'igst',
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description',
      },
  ];


  useEffect(() => {
    axios.get(apiUrl +`getInventoryByWareHouseId/${state?.id}`)
      .then(response => {
       setRowData(response.data)
       console.log(response.data)

      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.id]);




  const align = 'horizontal' 
  
  return (
    <div style={{ minWidth: "100%", marginTop: "1rem" }}>
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
            href={paths.dashboard.invoices.details}
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
                Warehouse List
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
      <h2>Warehouse</h2>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader title="Warehouse Detail" />
        <PropertyList>
          <PropertyListItem align={align} label="Name">
            <Typography variant="subtitle2">{state?.name}</Typography>
          </PropertyListItem>
          <Divider />
          <PropertyListItem
            align={align}
            label="Address"
            value={
              state?.address +
              ", " +
              state?.city +
              ", " +
              state?.state +
              ", " +
              state?.country
            }
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Zip Code"
            value={state?.zipcode}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Description"
            value={state?.description}
          />
        </PropertyList>
        <Divider />
      </Card>
      <Card style={{ marginBottom: "40px" }}>
        <Box
          sx={{ position: "relative", overflowX: "auto", marginBottom: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              pagination={false}
              columns={columns}
              dataSource={rowData?.map((row) => ({
                ...row,
                key: row.id,
              }))}
            ></Table>
          </Scrollbar>
        </Box>
        <Divider />
      </Card>
    </div>
  );
};

ViewWarehouseDetail.propTypes = {
  customer: PropTypes.object.isRequired
};
