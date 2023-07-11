
import {
  Typography,
  IconButton,
  Icon,
  Link,
  InputBase,
  TextField,
  MenuItem
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
import './inventory.css'
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';

  //get userid 
  const userId = sessionStorage.getItem('user') || localStorage.getItem('user');

  // const typeDropdown = [
  //   {
  //     label: 'Parts',
  //     value: 'Parts'
  //   },
  //   {
  //     label: 'Spare Parts',
  //     value: 'Spare Parts'
  //   },
    
  // ];

const ViewInventory = () => {

  const [userData, setUserData]= useState([])
  //product
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  //warehouse
  const [isSearchingWarehouse, setIsSearchingWarehouse] = useState(false);
  const [warehouseText, setWarehouseText] = useState('');
  //category
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [categoryText, setCategoryText] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');




  const navigate = useNavigate();
  
 
  useEffect(() => {
    axios.get(apiUrl +`getInventoryByUserId/${userId}`)
      .then(response => {
        setUserData(response.data);

      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  console.log(userData)

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));

  const filteredData = selectedCategory
  ? dataWithKeys.filter((item) => item.productType === selectedCategory)
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
    await axios.delete(apiUrl +`deleteInventoryById/${id}`);
    const updatedRows = userData.filter(item => item.id  !== id);
    setUserData(updatedRows);
    notify(
      "success",
      `Sucessfully deleted inventory row.`
    );
  } catch (error) {
    console.error('Error deleting row:', error.message);
  }
};

const handleNavigation = record => {
  navigate('/dashboard/inventory/edit', { state: record });
};

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
  const productNameMatch = product?.product?.productName?.toLowerCase().includes(searchText.toLowerCase());
  const warehouseNameMatch = product?.warehouse?.name?.toLowerCase().includes(warehouseText.toLowerCase());
  const categoryNameMatch = product?.category?.name?.toLowerCase().includes(categoryText.toLowerCase());

  return (
    (searchText === '' || productNameMatch) &&
    (warehouseText === '' || warehouseNameMatch) &&
    (categoryText === '' || categoryNameMatch)
  );
});
  
  console.log(filteredProducts)
 

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      dataIndex: "product",
      key: "product",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/inventory/viewDetail/${record.id}`, {
            state: record,
          });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
              textAlign: "center",
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">{name.productName}</Typography>
          </Link>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isSearchingWarehouse ? (
            <>
              <Typography variant="subtitle2">Warehouse</Typography>
              <IconButton onClick={handleWarehouseClick}>
                <SearchIcon />
              </IconButton>
            </>
          ) : (
            <>
              <InputBase
                value={warehouseText}
                onChange={handleWarehouseInputChange}
                placeholder="Search Warehouse..."
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
      key: "warehouse",
      dataIndex: "warehouse",
      render: (text) => text.name,
    },
    {
      title: "Available Stock",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "HSN Code",
      key: "hsncode",
      dataIndex: "hsncode",
    },

    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
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
                placeholder="Search Category..."
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
      key: "category",
      dataIndex: "category",
      render: (text) => text.name,
    },
    {
      title: "Cost",
      key: "price",
      dataIndex: "price",
    },
    {
      dataIndex: "actionEdit",
      key: "actionEdit",
      render: (_, record) => (
        <IconButton onClick={() => handleNavigation(record)}>
          <Icon>
            <EditIcon />
          </Icon>
        </IconButton>
      ),
    },
    {
      dataIndex: "actionDelete",
      key: "actionDelete",
      render: (_, row) => (
        <IconButton onClick={handleRemoveRow(row.id)}>
          <Icon>
            <Delete />
          </Icon>
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ minWidth: '100%' }}>
     <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>View Inventory</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
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
        </div>
      );
    };
    
    export default ViewInventory;