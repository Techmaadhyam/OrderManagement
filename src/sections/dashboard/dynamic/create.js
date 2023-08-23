import { useEffect, useState } from 'react'
import useAuthStore from "src/store/store";
import { TextField, Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, Box } from '@mui/material';
import axios from 'axios';
import { apiUrl } from 'src/config';
import IconWithPopup from "src/sections/dashboard/user/user-icon";
import Logo from "src/sections/dashboard/logo/logo";


const Create = () => {
  // Get the id from the url to fetch the data
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("/");
  const id = urlParts[urlParts.length - 1];
  // console.log("id", id);
  const user = useAuthStore((state) => state.user);


  // console.log(user);

  // State data
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  // Use effect to fetch the data
  useEffect(() => {
    const fetchData = async () => {
      axios.get(apiUrl + `getSchemaObjFields/${user.company.id}/${user.profile.id}/${id }`)
        .then((response) => {
          setFormFields(response.data);
          setFormValues(Object.fromEntries(response.data.map((field) => [field.fieldname, ""])));
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
    fetchData();
  }, [id, user.company.id, user.profile.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Event handler for form submission
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     // Assuming you have an API endpoint to post the form data
  //     const response = await fetch('http://your-post-api-url', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formValues),
  //     });
  //     const result = await response.json();
  //     console.log('Form submitted successfully:', result);
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //   }
  // };
  //sample submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const  current_date = new Date().toLocaleDateString();
    // console.log(current_date); 
    // console.log(formValues);
    const formData = {
      schemaRecord:{
        'recordid':'abc',
        'company':{'id':user.company.id},
        'profile':{'id':user.profile.id},
        'appobject':{'id':3},
        'createdby':{'id':user.id},
        'lastmodifiedby':{'id':user.id},
        'createddate':current_date,
        'lastmodifieddate':"date",

      },
      'fieldValues': {
        ...formValues,
      }
    };
    try{
      const response = await fetch(apiUrl+"createSch",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const result = await response.json()
    console.log(result);
    } catch(error){
      console.log(error);
    }
    
  }
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
          <h2 style={{ margin: 0 }}>Create </h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="have to set" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={2}>
              {formFields.map((field) => (
                <Grid item xs={12} md={6} key={field.id}>
                  {renderFormField(field, formValues, handleInputChange)}
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <Divider />
        </Card>

        <Grid xs={12} md={6}>
          <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              align="right"
            >
              Save
            </Button>
          </Box>
        </Grid>
      </form>
    </div>
  );
};

// Helper function to render the appropriate form field based on field type
const renderFormField = (field, formValues, handleInputChange) => {
  switch (field.fieldtype) {
    case 'Dropdown':
      const dropdownOptions = field.dropdownlovs.split(',').map((option) => option.trim());
      return (
        <TextField
          fullWidth
          label={field.fieldlabel}
          required={field.isrequired}
          name={field.fieldname}
          select
          SelectProps={{
            MenuProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
          value={formValues[field.fieldname]}
          onChange={handleInputChange}
        >
          {/* Assuming you have an array of options for dropdown */}
          {
            dropdownOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
      );

    default:
      return (
        <TextField
          margin='normal'
          fullWidth
          required={field.isrequired}
          label={field.fieldlabel}
          name={field.fieldname}
          value={formValues[field.fieldname]}
          onChange={handleInputChange}
        />
      );
  }
}

export default Create
