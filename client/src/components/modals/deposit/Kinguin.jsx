import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { claimGiftcardCode } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
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
      color: "#fff",
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

const Giftcard = ({ changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [redeeming, setRedeeming] = useState(false);
  const [GiftcardCode, setGiftcardCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setGiftcardCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const response = await claimGiftcardCode(GiftcardCode);

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
        console.log("There was an error while claiming Giftcard:", error);
        addToast(
          "There was an error while claiming this Giftcard code. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <DialogContent dividers>
            <Box position="relative" className={classes.progressbox}>
              <TextField
                className="input"
                variant="outlined"
                label="Giftcard Code"
                style={{ color: "#fff" }}
                onChange={onChange}
                value={GiftcardCode}
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
              You can buy kinguin giftcards on our kinguin shop using credit/debit cards, paypal, and more!
            </h4>
          </DialogContent>
        </Box>
      </Fragment>
    </Box>
  );
};

Giftcard.propTypes = {
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Giftcard);