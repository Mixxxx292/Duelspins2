import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

// Components
import Litecoin from "./withdraw/Litecoin";
import Bitcoin from "./withdraw/Bitcoin";

// Assets
import bitcoin from "../../assets/bitcoin.png";
import litecoin from "../../assets/litecoin.png";
import bitcoinICO from "../../assets/bitcoin-icon.png";
import litecoinICO from "../../assets/litecoin-icon.png";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#1F2225",
      color: "#fff",
      maxWidth: "1000px",
    },
  },
  cryptos: {
    minWidth: "674px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      minWidth: 0,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      opacity: 0.75,
      backgroundColor: "#f8931a",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
      "&::active": {
        opactiy: 1,
      }
    },
    "& button:nth-child(2)": {
      opacity: 0.75,
      backgroundColor: "#b8b9bb",
      marginLeft: 10,
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
      "&::active": {
        opactiy: 1,
      }
    },
  },
  crypto: {
    height: "5rem",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
}));

const Market = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const [crypto, setCrypto] = useState("btc");

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogContent className={classes.cryptos} dividers>
        <Box display="flex">
          <Button
            onClick={() => setCrypto("btc")}
            className={classes.crypto}
            variant="contained"
          >
            <img className={classes.desktop} src={bitcoin} alt="bitcoin" />
            <img className={classes.mobile} src={bitcoinICO} alt="bitcoinICO" />
          </Button>
          <Button
            onClick={() => setCrypto("ltc")}
            className={classes.crypto}
            variant="contained"
          >
            <img className={classes.desktop} src={litecoin} alt="litecoin" />
            <img
              className={classes.mobile}
              src={litecoinICO}
              alt="litecoinICO"
            />
          </Button>
        </Box>
        <Box display="flex" flexDirection="column">
          {crypto === "btc" ? (
            <Fragment>
              <Bitcoin />
            </Fragment>
          ) : crypto === "ltc" ? (
            <Fragment>
              <Litecoin />
            </Fragment>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Market;
