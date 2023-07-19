import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
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
} from "@mui/material";
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const TotalCost = (props) => {
  const { amount } = props;

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <div>
          <SvgIcon fontSize="large" color="primary">
            <PaymentsTwoToneIcon />
          </SvgIcon>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="text.secondary" variant="body2">
              Total taxable PO amount
            </Typography>
            <Tooltip
              title="This shows taxable total purchase order amount of selected month ."
              arrow
            >
              <InfoOutlinedIcon
                color="primary"
                fontSize="small"
                sx={{ ml: 1 }}
              />
            </Tooltip>
          </Box>
          <Typography color="text.primary" variant="h4">
            ₹ {amount}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

TotalCost.propTypes = {
  amount: PropTypes.string.isRequired
};
