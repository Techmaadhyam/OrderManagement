import PropTypes from 'prop-types';
import { formatDistanceStrict } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
  Typography,
  TextField,
  InputBase,
  Icon,
  MenuItem,
  Pagination
} from '@mui/material';
import { customLocale } from 'src/utils/date-locale';
import React, { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReceiptCheckIcon from 'src/icons/untitled-ui/duocolor/receipt-check';
import { useNavigate } from 'react-router-dom';
import ShoppingBag03Icon from "src/icons/untitled-ui/duocolor/shopping-bag-03";



const countPerPage = 4;

export const InventoryList = (props) => {
  const navigate = useNavigate();


  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');


  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages


  const { messages } = props;
  console.log(messages);
  const filteredMessages = messages?.filter(message =>
      message?.product.productName?.toLowerCase().includes(searchText?.toLowerCase())
  );

//company search
const handleCompanyClick = () => {
  setIsSearching(true);
};

const handleCompanyInputChange = event => {
  setSearchText(event.target.value);
};

const handleCompanyCancel = () => {
  setIsSearching(false);
  setSearchText('');
};


const totalPages = Math.ceil(filteredMessages.length / countPerPage);

const startIndex = (currentPage - 1) * countPerPage;
const endIndex = startIndex + countPerPage;
const currentMessages = filteredMessages.slice(startIndex, endIndex);

const handlePageChange = (event, page) => {
  setCurrentPage(page);
};

const handleNavigate =(messages) => {
  navigate(`/dashboard/inventory/viewDetail/${messages.inventoryId}`, {
    state: messages,
  });
};

return (
  <Card>
    <CardHeader
      title={
        <>
          {!isSearching && (
            <>
              Your Inventory
              <IconButton onClick={handleCompanyClick}>
                <SearchIcon />
              </IconButton>
            </>
          )}
          {isSearching && (
            <>
              <InputBase
                value={searchText}
                onChange={handleCompanyInputChange}
                placeholder="Search Inventory..."
              />
              <IconButton onClick={handleCompanyCancel}>
                <Icon>
                  <HighlightOffIcon />
                </Icon>
              </IconButton>
            </>
          )}
        </>
      }
      action={
        <Typography
          color="text.secondary"
          sx={{ whiteSpace: "nowrap", paddingTop: "15px" }}
          variant="subtitle1"
        >
          Availability
        </Typography>
      }
    />
    <Divider />
    <List disablePadding>
      {currentMessages?.map((message) => {
        return (
          <ListItem
            key={message.id}
            onClick={() => handleNavigate(message)}
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
                cursor: "pointer",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: "#f3ab33", color: "#ffffff" }}>
                <ShoppingBag03Icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  variant="subtitle2"
                >
                  {message?.product?.productName}
                </Typography>
              }
              secondary={
                <Typography
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  variant="body2"
                >
                  {message?.warehouse?.name}
                </Typography>
              }
              sx={{ pr: 2 }}
            />
            <Typography
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
              variant="subtitle2"
            >
              Quantity: {message?.quantity}
            </Typography>
          </ListItem>
        );
      })}
    </List>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      size="small"
      sx={{ mt: 2, mb: 2, justifyContent: "center" }}
    />
  </Card>
);
};

InventoryList.propTypes = {
  messages: PropTypes.array.isRequired
};
