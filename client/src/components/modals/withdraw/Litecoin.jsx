import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { withdrawCrypto } from "../../../services/api.service";
import PropTypes from "prop-types";
import { changeWallet, exchangeTokens } from "../../../actions/auth";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 25,
    padding: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    marginTop: "25px",
    "& > div": {
      transform: "",
      "& label": {
        color: "#FFFFFF",
      },
      "& label.Mui-focused": {
        color: "#2C3034",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#2C3034",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#151515",
        },
        "&:hover fieldset": {
          borderColor: "#151515",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#2C3034",
        },
      },
      "& > div > input": {
        transform: "",
      },
    },
    "& > div > div": {
      background: "#151515 !important",
    },
  },
  siteValue: {
    marginTop: "0.5rem",
    marginRight: "2rem",
    position: "relative",
    width: "20%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#151515 !important",
      },
      "& > div > input": {
        transform: "",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  },
  usdValue: {
    marginLeft: "2rem",
    marginTop: "0.5rem",
    position: "relative",
    width: "20%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#151515 !important",
      },
      "& > div > input": {
        transform: "",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  },
  Depvalue: {
    position: "relative",
    width: "75%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#151515 !important",
      },
      "& > div > input": {
        transform: "",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "white",
      backgroundColor: "#2C3034 !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    display: "flex",
    color: "white",
    backgroundColor: "#2C3034 !important",
    width: "100%",
    marginTop: "1rem",
    transform: "",
    height: "3rem",
    alignItems: "center",
  },
  maxButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: "0.5rem",
    "& button": {
      color: "white",
      backgroundColor: "#2C3034 !important",
      marginRight: "1rem",
      width: "6rem",
    },
  },
  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    display: "flex",
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
    },
  },
}));

const Litecoin = ({ user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [withdrawing, setWithdrawing] = useState(false);
  const [address, setAddress] = useState("");
  const [siteValue, setSiteValue] = useState("");
  const [usdValue, setUsdValue] = useState("");

  // TextField onChange event handler
  const addressOnChange = (e) => {
    setAddress(e.target.value);
  };

  // TextField onChange event handler
  const siteValueOnChange = (e) => {
    if (typeof e === "number") {
      const usdAmount = e ? parseFloat(e / 1.4).toFixed(2) : 0;
      setUsdValue(usdAmount);
      setSiteValue(e.toFixed(2));
    } else {
      // Convert address value to site value and USD value
      const usdAmount = e?.target?.value
        ? parseFloat(e?.target?.value / 1.4).toFixed(2)
        : "";
      setUsdValue(usdAmount);
      setSiteValue(e?.target?.value);
    }
  };

  // TextField onChange event handler
  const usdValueOnChange = (e) => {
    if (typeof e === "number") {
      const siteAmount = e ? (parseFloat(e) * 1.4).toFixed(2) : 0;
      setSiteValue(siteAmount);
      setUsdValue(e.toFixed(2));
    } else {
      // Convert address value to site value and USD value
      const siteAmount = e?.target?.value
        ? (parseFloat(e?.target?.value) * 1.4).toFixed(2)
        : "";
      setSiteValue(siteAmount);
      setUsdValue(e?.target?.value);
    }
  };

  // Button onClick event handler
  const onClick = async () => {
    setWithdrawing(true);
    try {
      const response = await withdrawCrypto(
        "LTC",
        address,
        parseFloat(siteValue)
      );
      console.log(response);
      // Update state
      setWithdrawing(false);
      changeWallet({ amount: -Math.abs(response.siteValue) });

      // Check transaction status
      if (response.state === 1) {
        addToast(
          `Successfully withdrawed 💵 ${response.siteValue.toFixed(
            2
          )} ($${(response.siteValue.toFixed(2) / 1.4).toFixed(2)}) Litecoin! Your withdrawal should arrive within a few minutes!`,
          { appearance: "success" }
        );
      } else if (response.state === 4) {
        addToast(
          `Admin verification withdraw needed for your withdraw of 💵 ${response.siteValue.toFixed(
            2
          )} ($${(response.siteValue.toFixed(2) / 1.4).toFixed(2)}) Litecoin!`,
          { appearance: "info" }
        );
      } else {
        addToast(
          `Successfully withdrawed 💵 ${response.siteValue.toFixed(
            2
          )} ($${(response.siteValue.toFixed(2) / 1.4).toFixed(2)}) Litecoin! Your withdrawal should arrive within a few minutes!`,
          { appearance: "success" }
        );
      }
    } catch (error) {
      setWithdrawing(false);

      // If user generated error
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        console.log("There was an error while withdrawing crypto:", error);
        addToast(
          "There was an error while requesting this withdrawal. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box>
          Withdraw your desired amount of Litecoin (LTC) to the following
          address.
        </Box>
        <Box className={classes.inputs}>
        <TextField
          label="Your Litecoin Address"
          variant="outlined"
          color="#1F2225"
          value={address}
          onChange={addressOnChange}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box className={classes.siteValue}>
            <TextField
              label={
                <span >
                  💵 CASH
                </span>
              }
              InputLabelProps={{
                style: { textAlign: "center" }
              }}
              variant="outlined"
              color="#fff"
              value={siteValue}
              onChange={siteValueOnChange}
            />
          </Box>
          <b style={{ marginTop: "0.5rem", fontSize: "1rem" }}>=</b>
          <Box className={classes.usdValue}>
            <TextField
                label={
                  <span >
                    $ USD
                  </span>
                }
                InputLabelProps={{
                  style: { textAlign: "center" }
                }}
                variant="outlined"
                color="#fff"
                value={usdValue}
                onChange={usdValueOnChange}
              />
          </Box>
        </Box>
      </Box>
        {/*
        <Box className={classes.maxButton}>
          <Button onClick={() => siteValueOnChange(user ? user.wallet : 0)}>MAX</Button>
        </Box>
          */}
        <Button
          className={classes.withdraw}
          onClick={onClick}
          disabled={withdrawing}
        >
          {withdrawing ? "Withdrawing..." : "Request Withdrawal"}
        </Button>
      </Fragment>
    </Box>
  );
};

Litecoin.propTypes = {
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Litecoin);