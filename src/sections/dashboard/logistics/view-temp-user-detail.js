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
import Logo from '../logo/logo';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiUrl } from 'src/config';
import { Table } from "antd";
import { Box } from "@mui/system";
import { Scrollbar } from "src/components/scrollbar";
import { useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ShoppingCart01Icon from "src/icons/untitled-ui/duocolor/shopping-cart-01";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import LayoutAlt02Icon from "src/icons/untitled-ui/duocolor/layout-alt-02";
import ListAltTwoToneIcon from "@mui/icons-material/ListAltTwoTone";


const userId = sessionStorage.getItem("user") || localStorage.getItem("user");
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear().toString();



export const ViewTemporaryUserDetail = (props) => {

  const location = useLocation();
    const navigate = useNavigate();
  const state = location.state;

  const [po, setPo] = useState([])
  const [so, setSo] = useState([]);
  const [wo, setWo] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [quotation, setQuotation] = useState([]);
   const [selectedDate, setSelectedDate] = useState(
     dayjs(`${currentMonth} ${currentYear}`)
  );
  const quotationColumn = [
    {
      title: "Quotation Order Number",
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/quotation/viewDetail`, { state: record });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
     
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">QO:{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Company Name",
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "Order Modified Date",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
    },
    {
      title: "Order Date",
      key: "createdDate",
      dataIndex: "createdDate",
    },
    {
      title: "Delivery Date",
      key: "deliveryDate",
      dataIndex: "deliveryDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      dataIndex: "totalAmount",
    },
  ];
  const salesColumn = [
    {
      title: "Sales Order Number",
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/orders/viewDetail/${record.id}`, {
            state: record,
          });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
            
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">SP:{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Company Name",
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "Order Modified Date",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
    },
    {
      title: "Order Date",
      key: "createdDate",
      dataIndex: "createdDate",
    },
    {
      title: "Delivery Date",
      key: "deliveryDate",
      dataIndex: "deliveryDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      dataIndex: "totalAmount",
    },
  ];
  const purchaseColumn = [
    {
      title: "Purchase Order Number",
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/purchaseorder/viewDetail/${record.id}`, {
            state: record,
          });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
   
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">PO:{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Company Name",
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "Order Modified Date",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
    },
    {
      title: "Order Date",
      key: "createdDate",
      dataIndex: "createdDate",
    },
    {
      title: "Delivery Date",
      key: "deliveryDate",
      dataIndex: "deliveryDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      dataIndex: "totalAmount",
    },
  ];

  const workColumn = [
    {
      title: "Work Order Number",
      dataIndex: "id",
      key: "id",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate("/dashboard/services/workorderDetail", { state: record });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
             
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">WO:{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Company Name",
      key: "companyName",
      dataIndex: "companyName",
    },
    {
      title: "Order Modified Date",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
    },
    {
      title: "Order Date",
      key: "createdDate",
      dataIndex: "createdDate",
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Total Amount",
      key: "totalamount",
      dataIndex: "totalamount",
    },
  ];


  const align = 'horizontal' 

    function formatDate(dateString) {
      const parsedDate = new Date(dateString);
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
  }
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const monthYear = date?.format("MMMM/YYYY").toLowerCase();
    const [newMonth, newYear] = monthYear.split("/");
    setMonth(newMonth);
    setYear(newYear);

    axios
      .get(
        apiUrl +
          `getRecordBasedOnCustomerId/${userId}/${state.id}/${
            newMonth || currentMonth?.toLowerCase()
          }/${newYear || currentYear}`
      )
      .then((response) => {
        let poList = [
          ...response.data.poList.slice(-4).map((obj) => ({
            ...obj,
            lastModifiedDate: formatDate(obj.lastModifiedDate),
            createdDate: formatDate(obj.createdDate),
            deliveryDate: formatDate(obj.deliveryDate),
            companyName:
              obj.tempUser?.companyName || obj.companyuser?.companyName,
            category: "poList",
          })),
        ];
        let soList = [
          ...response.data.soList.slice(-4).map((obj) => ({
            ...obj,
            lastModifiedDate: formatDate(obj.lastModifiedDate),
            createdDate: formatDate(obj.createdDate),
            deliveryDate: formatDate(obj.deliveryDate),
            companyName:
              obj.tempUser?.companyName || obj.companyuser?.companyName,
            category: "soList",
          })),
        ];

        let woList = [
          ...response.data.workOrderList.slice(-4).map((obj) => ({
            ...obj,
            lastModifiedDate: formatDate(obj.lastModifiedDate),
            createdDate: formatDate(obj.createdDate),
            companyName:
              obj.noncompany?.companyName || obj.company?.companyName,
            category: "woList",
          })),
        ];
        let quotationList = [
          ...response.data.quotationList.slice(-4).map((obj) => ({
            ...obj,
            lastModifiedDate: formatDate(obj.lastModifiedDate),
            createdDate: formatDate(obj.createdDate),
            deliveryDate: formatDate(obj.deliveryDate),
            companyName:
              obj.tempUser?.companyName || obj.companyuser?.companyName,
            category: "qoList",
          })),
        ];

        setPo(poList);
        setSo(soList);
        setWo(woList);
        setQuotation(quotationList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };



  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          apiUrl +
            `getRecordBasedOnCustomerId/${userId}/${
              state.id
            }/${currentMonth?.toLowerCase()}/${currentYear}`
        )
        .then((response) => {
          console.log(response.data);

          let poList = [
            ...response.data.poList.slice(-4).map((obj) => ({
              ...obj,
              lastModifiedDate: formatDate(obj.lastModifiedDate),
              createdDate: formatDate(obj.createdDate),
              deliveryDate: formatDate(obj.deliveryDate),
              companyName:
                obj.tempUser?.companyName || obj.companyuser?.companyName,
              category: "poList",
            })),
          ];
          let soList = [
            ...response.data.soList.slice(-4).map((obj) => ({
              ...obj,
              lastModifiedDate: formatDate(obj.lastModifiedDate),
              createdDate: formatDate(obj.createdDate),
              deliveryDate: formatDate(obj.deliveryDate),
              companyName:
                obj.tempUser?.companyName || obj.companyuser?.companyName,
              category: "soList",
            })),
          ];

          let woList = [
            ...response.data.workOrderList.slice(-4).map((obj) => ({
              ...obj,
              lastModifiedDate: formatDate(obj.lastModifiedDate),
              createdDate: formatDate(obj.createdDate),
              companyName:
                obj.noncompany?.companyName || obj.company?.companyName,
              category: "woList",
            })),
          ];
          let quotationList = [
            ...response.data.quotationList.slice(-4).map((obj) => ({
              ...obj,
              lastModifiedDate: formatDate(obj.lastModifiedDate),
              createdDate: formatDate(obj.createdDate),
              deliveryDate: formatDate(obj.deliveryDate),
              companyName:
                obj.tempUser?.companyName || obj.companyuser?.companyName,
              category: "qoList",
            })),
          ];

          setPo(poList);
          setSo(soList);
          setWo(woList);
          setQuotation(quotationList);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchData();
  }, [userId, state?.id, currentMonth, currentYear]);


   const handleNavigation1 = () => {
     navigate(`/dashboard/logistics/viewAllQo`, {
       state: {
         id: state.id,
         month: month || currentMonth?.toLowerCase(),
         year: year || currentYear,
       },
     });
  };
    const handleNavigation2 = () => {
      navigate(`/dashboard/logistics/viewAllSo`, {
        state: {
          id: state.id,
          month: month || currentMonth?.toLowerCase(),
          year: year || currentYear,
        },
      });
    };
  const handleNavigation3 = () => {
    navigate(`/dashboard/logistics/viewAllPo`, {
      state: {
        id: state.id,
        month: month || currentMonth?.toLowerCase(),
        year: year || currentYear,
      },
    });
  };
    const handleNavigation4 = () => {
      navigate(`/dashboard/logistics/viewAllWo`, {
        state: {
          id: state.id,
          month: month || currentMonth?.toLowerCase(),
          year: year || currentYear,
        },
      });
    };
  console.log(month, year)

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
            href={paths.dashboard.logistics.fleet}
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
                Customer / Vendor List
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
      <h2>{state?.type === "Vendor" ? "Vendor" : "Customer"}</h2>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title={state?.type === "Vendor" ? "Vendor Detail" : "Customer Detail"}
        />
        <PropertyList>
          <PropertyListItem align={align} label="Company Contact Person">
            <Typography variant="subtitle2">
              {state?.contactpersonname}
            </Typography>
          </PropertyListItem>
          <Divider />
          <PropertyListItem
            align={align}
            label="Email"
            value={state?.emailId}
          />
          <Divider />
          <PropertyListItem align={align} label="Type" value={state?.type} />
          <Divider />
          <PropertyListItem
            align={align}
            label="Company"
            value={state?.companyName}
          />
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
              state?.country +
              "-" +
              state?.pincode
            }
          />
        </PropertyList>
        <Divider />
      </Card>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title="Based on the selected time period"
          action={
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    variant="filled"
                    label={"Month and Year"}
                    views={["month", "year"]}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </>
          }
        />
      </Card>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <LayoutAlt02Icon />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Quotation list
              </Typography>
              <Typography variant="h6" sx={{ ml: 1 }}>
                ({ quotation.length})
              </Typography>
            </Box>
          }
          action={
            <Link
              color="primary"
              onClick={handleNavigation1}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
              underline="hover"
            >
              <Typography variant="subtitle1">View all</Typography>
            </Link>
          }
        />
        <Divider />
        <Box
          sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={quotationColumn}
              dataSource={quotation}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        </Box>
      </Card>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <InventoryTwoToneIcon />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Sales Order list
              </Typography>
              <Typography variant="h6" sx={{ ml: 1 }}>
                ({ so.length })
              </Typography>
            </Box>
          }
          action={
            <Link
              color="primary"
              onClick={handleNavigation2}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
              underline="hover"
            >
              <Typography variant="subtitle1">View all</Typography>
            </Link>
          }
        />
        <Divider />
        <Box
          sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={salesColumn}
              dataSource={so}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        </Box>
      </Card>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCart01Icon />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Purchase Order list
              </Typography>
              <Typography variant="h6" sx={{ ml: 1 }}>
                ({ po.length })
              </Typography>
            </Box>
          }
          action={
            <Link
              color="primary"
              onClick={handleNavigation3}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
              underline="hover"
            >
              <Typography variant="subtitle1">View all</Typography>
            </Link>
          }
        />
        <Divider />
        <Box
          sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={purchaseColumn}
              dataSource={po}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        </Box>
      </Card>
      <Card style={{ marginBottom: "12px" }}>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListAltTwoToneIcon />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Work Order list
              </Typography>
              <Typography variant="h6" sx={{ ml: 1 }}>
                ({ wo.length })
              </Typography>
            </Box>
          }
          action={
            <Link
              color="primary"
              onClick={handleNavigation4}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
              underline="hover"
            >
              <Typography variant="subtitle1">View all</Typography>
            </Link>
          }
        />
        <Divider />
        <Box
          sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}
        >
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={workColumn}
              dataSource={wo}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        </Box>
      </Card>
    </div>
  );
};

ViewTemporaryUserDetail.propTypes = {
  customer: PropTypes.object.isRequired
};