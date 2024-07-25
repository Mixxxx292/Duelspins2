import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { claimCouponCode } from "../../services/api.service";
import { changeWallet } from "../../actions/auth";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#1F2225",
      color: "#fff",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
  },
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#507afd",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#FFF",
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#5f679a",
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "#151515",
      "& > input": {
        transform: "",
      },
    },
    "& > div": {
      width: "100%",
      transform: "",
      "& label": {
        color: "#fff",
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
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#2C3034",
      color: "white",
      transform: "",
      "&:hover": {
        background: "#2C3034",
      },
      "& .MuiButton-label": {
        transform: "",
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
}));

const Coupon = ({ open, handleClose, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [redeeming, setRedeeming] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCouponCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const response = await claimCouponCode(couponCode);

      // Update state
      setRedeeming(false);
      addToast(response.message, { appearance: "success" });
      changeWallet({ amount: response.payout });
    } catch (error) {
      setRedeeming(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
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
        console.log("There was an error while claiming coupon:", error);
        addToast(
          "There was an error while claiming this coupon code. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Coupon
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="Coupon Code"
            onChange={onChange}
            value={couponCode}
          />
          <Button
            className="saveBtn"
            variant="contained"
            onClick={onClick}
            disabled={redeeming}
          >
            {redeeming ? "Redeeming..." : "Redeem"}
          </Button>
        </Box>
        <h4 className={classes.vipDesc}>
          You can find coupons by being active on our social media and in our discord.
        </h4>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Coupon.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Coupon);
