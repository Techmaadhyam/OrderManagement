import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link
} from '@mui/material';
import { Table } from 'antd';
import { Box } from '@mui/system';
import React from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import EditIcon from '@mui/icons-material/Edit';
import {  Delete } from '@mui/icons-material';
import IconWithPopup from '../user/user-icon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './product.css'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, InputBase } from '@mui/material';

  //get userid 
  const userId = sessionStorage.getItem('user') || localStorage.getItem('user');

  
  const typeDropdown = [
    {
      label: 'Parts',
      value: 'Parts'
    },
    {
      label: 'Spare Parts',
      value: 'Spare Parts'
    },
    
  ];

const ViewProduct = () => {

  const [userData, setUserData]= useState([])

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

    //product
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    //warehouse
    const [isSearchingWarehouse, setIsSearchingWarehouse] = useState(false);
    const [warehouseText, setWarehouseText] = useState('');
    //category
    const [isSearchingCategory, setIsSearchingCategory] = useState(false);
    const [categoryText, setCategoryText] = useState('');

  const navigate = useNavigate();
  
 
  useEffect(() => {
    axios.get(`http://13.115.56.48:8080/techmadhyam/getAllItem/${userId}`)
      .then(response => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));


  const filteredData = selectedCategory
  ? dataWithKeys.filter((item) => item.type === selectedCategory)
  : dataWithKeys;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  

    //toast notification from toastify library
const notify = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};


const handleRemoveRow = (id) => async () => {
  try {
    await axios.delete(`http://13.115.56.48:8080/techmadhyam/deleteItemById/${id}`);
    const updatedRows = userData.filter(item => item.id !== id);
    setUserData(updatedRows);
    notify(
      "success",
      `Sucessfully deleted product row.`
    );
  } catch (error) {
    console.error('Error deleting row:', error.message);
  }
}

const handleEditRecord = (record) => {
  setEditRecord(record);
  setPopupVisible(true);
};

const handleSaveRecord = async (editedRecord) => {

  console.log('Saving edited record:', editedRecord);
  console.log(JSON.stringify({

    product: {
      id: editedRecord.id,
      productName: editedRecord.productName,
      type: editedRecord.type,
      createdBy: editedRecord.createdBy,
      lastModifiedDate: currentDate
      
    },
    category: {
      id: editedRecord.category.id,
      name: editedRecord.category.name,
      desccription: editedRecord.category.description,
      lastModifiedDate: currentDate
  
    }
  }))

  if (currentDate) {
    try {
      const response = await fetch('http://13.115.56.48:8080/techmadhyam/addProduct', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json'
        },
        body: JSON.stringify({

          product: {
            id: editedRecord.id,
            productName: editedRecord.productName,
            type: editedRecord.type,
            createdBy: editedRecord.createdBy,
            lastModifiedDate: currentDate,
            lastModifiedByUser: {id: userId},
            
          },
          category: {
            id: editedRecord.category.id
          }

        })
      });
      
      if (response.ok) {
       response.json().then(data => {
        console.log(data);
        window.location.reload()
   
       
});
      } 
    } catch (error) {
      console.error('API call failed:', error);
    }
  } 

};

console.log(selectedCategory)
//Get date
useEffect(() => {
  const today = new Date();
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('IN', options);
  setCurrentDate(formattedDate);
}, []);

 //product search
const handleProductClick = () => {
  setIsSearching(true);
};

const handleProductInputChange = event => {
  setSearchText(event.target.value);
};

const handleProductCancel = () => {
  setIsSearching(false);
  setSearchText('');
};
//warehouse search
const handleWarehouseClick = () => {
  setIsSearchingWarehouse(true);
};

const handleWarehouseInputChange = event => {
  setWarehouseText(event.target.value);
};

const handleWarehouseCancel = () => {
  setIsSearchingWarehouse(false);
  setWarehouseText('');
};

//category search
const handleCategoryClick = () => {
  setIsSearchingCategory(true);
};

const handleCategoryInputChange = event => {
  setCategoryText(event.target.value);
};

const handleCategoryCancel = () => {
  setIsSearchingCategory(false);
  setCategoryText('');
};

const filteredProducts = filteredData.filter(product => {
  const productNameMatch = product.productName?.toLowerCase().includes(searchText.toLowerCase());
  const warehouseNameMatch = product.partnumber?.toLowerCase().includes(warehouseText.toLowerCase());
  const categoryNameMatch = product.category.name?.toLowerCase().includes(categoryText.toLowerCase());

  return (
    (searchText === '' || productNameMatch) &&
    (warehouseText === '' || warehouseNameMatch) &&
    (categoryText === '' || categoryNameMatch)
  );
});

const columns = [
  {
    title: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isSearching ? (
          <>
            <Typography variant="subtitle2">Part Name</Typography>
            <IconButton onClick={handleProductClick}>
              <SearchIcon />
            </IconButton>
          </>
        ) : (
          <>
            <InputBase
              value={searchText}
              onChange={handleProductInputChange}
              placeholder="Search Name..."
            />
            <IconButton onClick={handleProductCancel}>
              <Icon>
                <HighlightOffIcon />
              </Icon>
            </IconButton>
          </>
        )}
      </div>
  ),
    dataIndex: 'productName',
    key: 'productName',
    render: (name, record) => {
     
      const handleNavigation = () => {
        navigate(`/dashboard/products/viewDetail`, { state: record });
      };
    
      return (
        <Link
          color="primary"
          onClick={handleNavigation}
          sx={{
            alignItems: 'center',
            textAlign: 'center',
          }}
          underline="hover"
        >
          <Typography variant="subtitle1">{name}</Typography>
        </Link>
      );
    }
  },
  {
    title: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isSearchingWarehouse? (
          <>
            <Typography variant="subtitle2">Part Number</Typography>
            <IconButton onClick={handleWarehouseClick}>
              <SearchIcon />
            </IconButton>
          </>
        ) : (
          <>
            <InputBase
              value={warehouseText}
              onChange={handleWarehouseInputChange}
              placeholder="Search Number..."
            />
            <IconButton onClick={handleWarehouseCancel}>
              <Icon>
                <HighlightOffIcon />
              </Icon>
            </IconButton>
          </>
        )}
      </div>
  ),
    key: 'partnumber',
    dataIndex: 'partnumber',
  },
  {
    title: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isSearchingCategory ? (
          <>
            <Typography variant="subtitle2">Model</Typography>
            <IconButton onClick={handleCategoryClick}>
              <SearchIcon />
            </IconButton>
          </>
        ) : (
          <>
            <InputBase
              value={categoryText}
              onChange={handleCategoryInputChange}
              placeholder="Search Model..."
            />
            <IconButton onClick={handleCategoryCancel}>
              <Icon>
                <HighlightOffIcon />
              </Icon>
            </IconButton>
          </>
        )}
      </div>
  ),
    key: 'category',
    dataIndex: 'category',
    render: (category) => category?.name
  },
  {
    title: 'Description',
    key: 'category',
    dataIndex: 'category',
    render: (category) => category?.description
  },
  {
    dataIndex: 'actionEdit',
    key: 'actionEdit',
    render: (_, record) => (
      <Link>
        <IconButton onClick={() => handleEditRecord(record)}>
          <Icon>
            <EditIcon />
          </Icon>
        </IconButton>
      </Link>
    ),
  },
  {
    dataIndex: 'actionDelete',
    key: 'actionDelete',
    render: (_, row) => (
      <IconButton onClick={handleRemoveRow(row.id)}>
        <Icon>
          <Delete />
        </Icon>
      </IconButton>
    ),
  },
];

  const PopupComponent = ({ record, onClose, onSave }) => {
    const [editedRecord, setEditedRecord] = useState(record);

    const handleChange = (event) => {
      const { name, value } = event.target;
    
      if (name === "category") {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          category: {
            ...prevRecord.category,
            name: value,
          },
        }));
      } else if (name === "description") {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          category: {
            ...prevRecord.category,
            description: value,
          },
        }));
      } else {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          [name]: value,
        }));
      }
    };

    const handleSave = () => {
      onSave(editedRecord);
      onClose();
    };


    return (
      <Dialog open={true} 
      onClose={onClose}>
        <DialogTitle>Edit Parts</DialogTitle>
        <DialogContent>
        <Grid
            container
            spacing={0}
            
          >
              <Grid
              xs={12}
              md={6}
            >
          <TextField
            label="Part Name"
            name="productName"
            value={editedRecord.productName}
            onChange={handleChange}
            style={{ marginBottom: 10 }}
          />
          </Grid>
          <Grid
              xs={12}
              md={6}
            >
          <TextField
            label="Model"
            name="category"
            value={editedRecord.category.name}
            style={{ marginBottom: 10 }}
          />
            </Grid>
            {/* <Grid
              xs={6}
              md={6}
            >
          <TextField
            label="Type"
            name="type"
            select
            value={editedRecord.type}
            onChange={handleChange}
            style={{ marginBottom: 10 }}
          >
             {typeDropdown.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
          </TextField>
          </Grid> */}
          <Grid
              xs={12}
              md={6}
            >
          <TextField
            label="Description"
            name="description"
            value={editedRecord.category.description}
            style={{ marginBottom: 10 }}
          />
          </Grid>
          
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} 
          color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} 
          color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };




  return (
    <div style={{ minWidth: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>View Parts</h2>
        <IconWithPopup/>
      </div>
      {/* <TextField

      label="Type"
      name="type"
      sx={{ minWidth: 250 }}
      value={selectedCategory}
      onChange={handleCategoryChange}
      select
      >
     <MenuItem value="">All</MenuItem>
        {typeDropdown.map((option) => (
          <MenuItem key={option.value} 
          value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}
      <Box sx={{ position: 'relative', overflowX: 'auto', marginTop:'30px' }}>
        <Scrollbar>
          <Table
            sx={{ minWidth: 800, overflowX: 'auto' }}
            columns={columns}
            dataSource={filteredProducts}
            rowClassName={() => 'table-data-row'}
            ></Table>
            </Scrollbar>
            <ToastContainer
                     position="top-right"
                     autoClose={2000}
                     hideProgressBar={false}
                     newestOnTop={false}
                     closeOnClick
                     rtl={false}
                     pauseOnFocusLoss
                     draggable
                     pauseOnHover
                     theme="light"/>
          </Box>
          {isPopupVisible && editRecord && (
        <PopupComponent
          record={editRecord}
          onClose={() => setPopupVisible(false)}
          onSave={handleSaveRecord}
        />
      )}
        </div>
      );
    };
    
    export default ViewProduct;