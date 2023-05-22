import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Link,
  SvgIcon,
  IconButton,
  Grid
} from '@mui/material';
import { wait } from 'src/utils/wait';
import './purchase-order.css'
import {  Box, Stack } from '@mui/system';
import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import { useCallback, useState } from 'react';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { Scrollbar } from 'src/components/scrollbar';
import { Table } from 'antd';
import { primaryColor } from 'src/primaryColor';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import IconWithPopup from '../user/user-icon';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';




const statusOptions = ['Canceled', 'Complete', 'Rejected'];
const columns = [
  {
    title: 'Name',
    dataIndex: 'productName',
    key: 'productName',
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




export const ViewPurchaseOrder = (props) => {
  const location = useLocation();
  const state = location.state;

 

 

  const { customer, ...other } = props;
  const [status, setStatus] = useState(statusOptions[0]);
  const [tempuser, setTempuser] =useState([])
  const [rowData, setRowData] =useState()

  const handleChange = useCallback((event) => {
    setStatus(event.target.value);
  }, []);
  const align = 'horizontal' 
  const formik = useFormik({
    initialValues: {
      address1: customer.address1 || '',
      address2: customer.address2 || '',
      country: customer.country || '',
      email: customer.email || '',
      hasDiscount: customer.hasDiscount || false,
      isVerified: customer.isVerified || false,
      name: customer.name || '',
      phone: customer.phone || '',
      state: customer.state || '',
      submit: null
    },
    validationSchema: Yup.object({
      address1: Yup.string().max(255),
      address2: Yup.string().max(255),
      country: Yup.string().max(255),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      hasDiscount: Yup.bool(),
      isVerified: Yup.bool(),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      phone: Yup.string().max(15),
      state: Yup.string().max(255)
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Customer updated');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getTempUserById/${state?.tempUserId || state?.purchaseOrderRec?.tempUserId}`)
      .then(response => {
       setTempuser(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getAllPurchaseOrderDetails/${state?.id || state?.purchaseOrderRec?.id}`)
      .then(response => {
       setRowData(response.data)

      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const rowDat1a = [
    {
      name: '',
      quantity: '',
      weight: "56kg",
      cost: '45689',
      gst:'10',
      cgst:'6',
      description: 'Handle with care',
    },
  ];

  return (
    <div style={{minWidth: "100%", marginTop: "1rem"  }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link
          color="text.primary"
          component={RouterLink}
          href={paths.dashboard.purchaseorder.view}
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
             Back To <span style={{color: `${primaryColor}` , fontWeight: 600}}>Purchase Order List</span> 
          </Typography>
        </Link>
        <IconWithPopup/>
      </div>
 <h2>Purchase Order</h2>
      <Card style={{marginBottom: "12px" }}>
        <CardHeader title="Product Order Detail" />
        <PropertyList>
        <PropertyListItem
          align={align}
          label="Username"
        >
          <Typography variant="subtitle2">
          {tempuser.firstName+' '+tempuser.lastName}
          </Typography>
        </PropertyListItem>
        <Divider />
        <PropertyListItem
          align={align}
          label="Purchase Order Number"
          value={state?.id || state?.purchaseOrderRec?.id}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Quotation"
          value={state?.quotation || state?.purchaseOrderRec?.quotation}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="DeliveryDate"
          value={state?.deliveryDate || state?.purchaseOrderRec?.deliveryDate}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Contact Name"
          value={state?.contactPerson || state?.purchaseOrderRec?.contactPerson}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Contact No"
          value={state?.contactPhone || state?.purchaseOrderRec?.contactPhone}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Status"
          value={state?.status || state?.purchaseOrderRec?.status}
        >
        </PropertyListItem>
      </PropertyList>
        <Divider/>
      </Card>
      <Card style={{marginBottom: "40px" }}>
      <Box sx={{  position: 'relative' , overflowX: "auto", marginBottom: '30px'}}>    
      <Scrollbar>
        <Table sx={{ minWidth: 800,overflowX: "auto" }} pagination={false} columns={columns} dataSource={rowData}></Table>
      </Scrollbar>
    </Box>
     <Grid
              xs={12}
              md={6}
            >
  <Typography style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Total Amount : 56,78,020</Typography>
            </Grid>
            <Grid
              xs={12}
              md={6}
              style={{marginTop: "20px", marginBottom: "30px"}}
            >
  <Typography style={{ fontFamily:"Arial, Helvetica, sans-serif", fontSize:"14px", marginRight: '6px', color:'black', fontWeight:"bold"}}>Terms &Conditions :  This product can be sold on the said customer</Typography>

            </Grid>
        <Divider/>
      </Card>
    </div>
  );
};

ViewPurchaseOrder.propTypes = {
  customer: PropTypes.object.isRequired
};