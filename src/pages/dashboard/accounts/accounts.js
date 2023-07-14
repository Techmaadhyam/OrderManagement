import { useCallback, useEffect, useState } from "react";
import { Box, Container, Stack, Card, CardHeader, CardContent, TextField, MenuItem } from "@mui/material";
import { customersApi } from "src/api/customers";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import PurchaseAccounts from "src/sections/dashboard/accounts/PurchaseAccounts";
import SalesAccounts from "src/sections/dashboard/accounts/SalesAccounts";
import WorkAccounts from "src/sections/dashboard/accounts/WorkAccounts";
import AmcAccounts from "src/sections/dashboard/accounts/AmcAccounts";
import Logo from "src/sections/dashboard/logo/logo";
import User from "src/sections/dashboard/user/user-icon";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const categoryBuySell = [
  {
    label: "Purchase Order",
    value: "Purchase Order",
  },
  {
    label: "Sales Order",
    value: "Sales Order",
  },
  {
    label: "Work Order",
    value: "workorder",
  },
  {
    label: "AMC",
    value: "amc",
  },
];

const Page = () => {
    const [selectedCategory, setSelectedCategory] = useState("Purchase Order");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedDate, setSelectedDate] = useState(dayjs(`${year}`));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const year = date?.format("YYYY");

    setYear(year);
    };
    
    const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
    };

  return (
    <>
      <Seo title="Dashboard: Customer Edit" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>Account Details</h2>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Logo />
              </div>
              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <User />
              </div>
            </div>

            <Box display="flex" sx={{ m: -2 }}>
              <TextField
                label="Category"
                name="category"
                sx={{ minWidth: 150 , mr: 1}}
                value={selectedCategory}
                onChange={handleCategoryChange}
                select
              >
                {categoryBuySell.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  variant="filled"
                  label="Year"
                  sx={{ width: 150 }}
                  openTo="year"
                  views={["year"]}
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </Box>
            {selectedCategory === "Purchase Order" && (
              <PurchaseAccounts year={year} />
            )}
            {selectedCategory === "Sales Order" && (
              <SalesAccounts year={year} />
            )}
            {selectedCategory === "workorder" && (
              <WorkAccounts year={year} category={selectedCategory} />
            )}
            {selectedCategory === "amc" && (
              <AmcAccounts year={year} category={selectedCategory} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
