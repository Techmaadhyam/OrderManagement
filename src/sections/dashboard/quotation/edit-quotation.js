import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
  Link,
  SvgIcon
} from '@mui/material';
import { DatePicker, Typography } from 'antd';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { wait } from 'src/utils/wait';
import CustomTable  from './customTable';
import './purchase-order.css'
import { Box } from '@mui/system';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';



const userOptions = [
  {
    label: 'Healthcare',
    value: 'healthcare'
  },
  {
    label: 'Makeup',
    value: 'makeup'
  },
  {
    label: 'Dress',
    value: 'dress'
  },
  {
    label: 'Skincare',
    value: 'skincare'
  },
  {
    label: 'Jewelry',
    value: 'jewelry'
  },
  {
    label: 'Blouse',
    value: 'blouse'
  }
];

export const EditQuotation = (props) => {
  const { customer, ...other } = props;
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

  return (
    <div style={{ minWidth: "100%" }}>
      <div>
        <Link
          color="text.primary"
          component={RouterLink}
          href={paths.dashboard.quotation.view}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          <SvgIcon sx={{ mr: 1 }}>
            <ArrowLeftIcon />
          </SvgIcon>
          <Typography variant="subtitle2">Quotation List</Typography>
        </Link>
      </div>
      <h2>Edit Quotation</h2>
      <form onSubmit={formik.handleSubmit} {...other}>
        <Card>
          <CardHeader title="Product Order Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.category && formik.errors.category)}
                  fullWidth
                  label="User"
                  name="user"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={formik.values.category}
                >
                  {userOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid />
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.category && formik.errors.category)}
                  fullWidth
                  label="Type"
                  name="type"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={formik.values.category}
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
                  error={!!(formik.touched.category && formik.errors.category)}
                  fullWidth
                  label="Quotation"
                  name="quotation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={formik.values.category}
                >
                  {userOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <DatePicker placeholder="Delivery Date" height="50px" />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.category && formik.errors.category)}
                  fullWidth
                  label="Status"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={formik.values.category}
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
                  error={!!(formik.touched.address1 && formik.errors.address1)}
                  fullWidth
                  helperText={formik.touched.address1 && formik.errors.address1}
                  label="Contact Name"
                  name="contactName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  // value={formik.values.address1}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.address1 && formik.errors.address1)}
                  fullWidth
                  helperText={formik.touched.address1 && formik.errors.address1}
                  label="Mobile No."
                  name="mobileno"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  // value={formik.values.address1}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
      <CustomTable regular={true} />
      <Grid xs={12} md={6}>
        <Box
          sx={{ mt: 2 }}
          display="flex"
          justifyContent="flex-end"
          marginRight="12px"
          marginBottom="30px"
        >
          <Button color="primary" variant="contained" align="right">
            Save
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

EditQuotation.propTypes = {
  customer: PropTypes.object.isRequired
};
