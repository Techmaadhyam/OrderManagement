import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Tooltip,
  CardHeader,
  Grid,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useState, useEffect } from "react";
import { apiUrl } from "src/config";
import ShoppingCart01Icon from "src/icons/untitled-ui/duocolor/shopping-cart-01";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";

const userId = parseInt(
  sessionStorage.getItem("user") || localStorage.getItem("user")
);
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear().toString();

export const Balance = (props) => {
  const [list1, setList1] = useState({});
  const [list2, setList2] = useState({});
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [selectedMonthPo, setSelectedMonthPo] = useState(0);
  const [selectedMonthSo, setSelectedMonthSo] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(`${currentMonth} ${currentYear}`)
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const monthYear = date?.format("MMMM/YYYY");
    const [newMonth, newYear] = monthYear.split("/");
    setMonth(newMonth);
    setYear(newYear);

    const apiCalls = [
      axios.get(apiUrl + `getEndpoint1/${userId}/${newYear }`),
      axios.get(apiUrl + `getEndpoint2/${userId}/${newYear }`),
    ];

    Promise.all(apiCalls)
      .then((responses) => {
        const transformedData1 = responses[0].data.reduce(
          (acc, { totalamount, paidamount, monthName }) => {
            acc[monthName] = { totalamount, paidamount };
            return acc;
          },
          {}
        );

        const transformedData2 = responses[1].data.reduce(
          (acc, { totalamount, paidamount, monthName }) => {
            acc[monthName] = { totalamount, paidamount };
            return acc;
          },
          {}
        );

        setList1(transformedData1);
        setList2(transformedData2);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          apiUrl +
            `getPurchaseOrderTotalAmountByMonthYear/${userId}/${currentYear}`
        );
        const response2 = await axios.get(
          apiUrl +
            `getSalesOrderTotalAmountByMonthYear/${userId}/${currentYear}`
        );

        const transformedData1 = response1.data.reduce(
          (acc, { totalamount, paidamount, monthName }) => {
            acc[monthName] = { totalamount, paidamount };
            return acc;
          },
          {}
        );

        const transformedData2 = response2.data.reduce(
          (acc, { totalamount, paidamount, monthName }) => {
            acc[monthName] = { totalamount, paidamount };
            return acc;
          },
          {}
        );

        setList1(transformedData1);
        setList2(transformedData2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    setSelectedMonthPo({
      totalamount: list1[month]?.totalamount || 0,
      paidamount: list1[month]?.paidamount || 0,
      pendingamount: list1[month]?.totalamount - (list1[month]?.paidamount||0) ||0,
    });
    setSelectedMonthSo({
      totalamount: list2[month]?.totalamount || 0,
      paidamount: list2[month]?.paidamount || 0,
      pendingamount:
        list2[month]?.totalamount - (list2[month]?.paidamount || 0) ||0,
    });
  }, [list1, list2, month]);
    


  return (
    <Card>
      <CardHeader
        title="My Balance"
        subheader={month + " " + year}
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
      <Divider />
      <Grid
        container
        sx={{ mt: 4, mb: 4, justifyContent: "space-evenly" }}
        spacing={0}
      >
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#EEF4FC",
            borderRadius: "15px",
            mb: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#7DA9E5",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <ShoppingCart01Icon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total PO amount
                </Typography>
                <Tooltip
                  title="This shows total purchase order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#7DA9E5" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthPo?.totalamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#faf0f3",
            borderRadius: "15px",
            mb: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#E26C8C",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <ShoppingCart01Icon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total paid PO amount
                </Typography>
                <Tooltip
                  title="This shows the total paid purchase order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#E26C8C" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthPo?.paidamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#EEF4FC",
            borderRadius: "15px",
            mb: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#7DA9E5",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <ShoppingCart01Icon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total PO amount to be paid
                </Typography>
                <Tooltip
                  title="This shows total pending purchase order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#7DA9E5" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthPo?.pendingamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#FBF7EE",
            borderRadius: "15px",
            mt: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#DCB065",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <InventoryTwoToneIcon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total SO amount
                </Typography>
                <Tooltip
                  title="This shows total sales order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#DCB065" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthSo?.totalamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#EFFBF5",

            borderRadius: "15px",
            mt: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#64DA9D",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <InventoryTwoToneIcon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total paid SO amount
                </Typography>
                <Tooltip
                  title="This shows the total paid sales order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#64DA9D" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthSo?.paidamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          xs={11}
          md={3.5}
          sx={{
            backgroundColor: "#FBF7EE",
            borderRadius: "15px",
            mt: 2,
          }}
        >
          <Stack
            alignItems="center"
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              px: 3,
              py: 4,
            }}
          >
            <div>
              <SvgIcon
                sx={{
                  backgroundColor: "#DCB065",
                  borderRadius: "50%",
                  padding: "7px",
                  fontSize: "2.7rem",
                }}
              >
                <InventoryTwoToneIcon />
              </SvgIcon>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total SO amount to be paid
                </Typography>
                <Tooltip
                  title="This shows total pending sales order amount of selected month ."
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#DCB065" }}
                  />
                </Tooltip>
              </Box>
              <Typography color="text.primary" variant="h4">
                ₹ {selectedMonthSo?.pendingamount?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
