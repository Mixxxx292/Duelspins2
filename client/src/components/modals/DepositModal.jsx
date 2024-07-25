import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

// Modals
import Market from "./MarketModal";

// Components
import Litecoin from "./deposit/Litecoin";
import Bitcoin from "./deposit/Bitcoin";
import Kinguin from "./deposit/Kinguin";

// Assets
import btcSvg from "../../assets/btc.svg";
import ltcSvg from "../../assets/ltc.svg";
import visa from "../../assets/visa.png"

// Custom Styles
const useStyles = makeStyles((theme) => ({
  modal: {
    "& div > div": {
      maxWidth: "1000px",
    },
  },
  popupBackground: {
    background: "#151719",
  },
  contentContainer: {
    background: "#151719",
    padding: theme.spacing(2),
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
  },
  conversionHeader: {
    fontSize: "1rem",
    textAlign: "center",
    color: "#808080",
  },
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  topPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  cryptoContainer: {
    display: "flex",
    alignItems: "center",
  },
  cryptoTitle: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
    color: "#fff",
  },
  btcText: {
    fontSize: "0.7rem"
  },
  bonusBox: {
    backgroundColor: "#182F2E",
    color: "#1ECA77",
    padding: theme.spacing(0.5, 1),
    marginLeft: theme.spacing(1),
    borderRadius: 3,
  },
  button: {
    backgroundColor: "#b8b9bb",
    marginLeft: theme.spacing(1),
    "&:first-child": {
      marginLeft: 0,
    },
  },
  reverse: {
    flexDirection: "column",
  },
  infoBoxContainer: {
    display: "flex",
  },
  infoBox: {
    cursor: "pointer",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    border: "1px solid lightgray",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    paddingRight: 10,
    marginLeft: 10,
    "& > img": {
      width: "6rem",
      marginRight: theme.spacing(2),
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  withdraw: {
    opacity: 0.75,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    background: "#26292D",
    marginLeft: "auto",
    padding: "0.8rem 1rem",
    borderRadius: "0.25rem",
    position: "relative",
    fontWeight: 600,
    cursor: "pointer",
    "& span": {
      color: "#fff",
      fontSize: 13,
    },
    "&:hover": {
      textShadow: "0px 0px 10px",
      opacity: 0.85,
    },
  },
  x:{
    backgroundColor: "#151719"
  }
}));

const Deposit = ({ open, handleClose }) => {
  const classes = useStyles();
  const [crypto, setCrypto] = useState(null);
  const [dialogWidth, setDialogWidth] = useState(800);
  const [openMarket, setOpenMarket] = useState(false);

  useEffect(() => {
    const updateDialogWidth = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 800) {
        setDialogWidth(windowWidth - 40);
      } else {
        setDialogWidth(800);
      }
    };

    window.addEventListener("resize", updateDialogWidth);
    updateDialogWidth();

    return () => {
      window.removeEventListener("resize", updateDialogWidth);
    };
  }, []);

  const handleCloseButtonClick = () => {
    setCrypto(null);
    handleClose();
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleCloseButtonClick}
      aria-labelledby="customized-dialog-title"
      open={open}
      PaperProps={{
        style: {
          maxWidth: dialogWidth,
          width: "100%",
        },
      }}
    >
      <DialogContent className={classes.popupBackground}>
        {!crypto ? (
          <Box className={classes.contentContainer}>
            <Box className={classes.topPanel}>
              <div className={classes.cryptoContainer}>
                <span className={classes.cryptoTitle}>Deposit:</span>
                <Box className={classes.bonusBox}>+40% Cash Bonus</Box>
              </div>
              <Box className={classes.buttonsContainer}>
                <Market
                  handleClose={() => setOpenMarket(!openMarket)}
                  open={openMarket}
                />
                <Box
                  className={classes.withdraw}
                  onClick={() => setOpenMarket(!openMarket)}
                >
                  <Box className={classes.reverse} flexDirection="column">
                    <span>Withdraw</span>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.infoBoxContainer} >
              <Box className={classes.infoBox} onClick={() => setCrypto("btc")}>
                <img src={btcSvg} alt="btc" className={classes.btcLogo} />
                <div>
                  <div className={classes.btcTitle}>
                    <strong>Bitcoin</strong>
                  </div>
                  <div className={classes.btcText}>1 USD = 1.4 CASH</div>
                </div>
              </Box>

              <Box className={classes.infoBox} onClick={() => setCrypto("ltc")}>
                <img src={ltcSvg} alt="ltc" className={classes.btcLogo} />
                <div>
                  <div className={classes.btcTitle}>
                    <strong>Litecoin</strong>
                  </div>
                  <div className={classes.btcText}>1 USD = 1.4 CASH</div>
                </div>
              </Box>

              <Box className={classes.infoBox} onClick={() => setCrypto("kinguin")}>
                <img src={visa} alt="visa" className={classes.btcLogo} />
                <div>
                  <div className={classes.btcTitle}>
                    <strong>Kinguin</strong>
                  </div>
                  <div className={classes.btcText}>1 USD = 1.4 CASH</div>
                </div>
              </Box>
            </Box>
            <DialogActions className={classes.x}>
              <Button onClick={handleCloseButtonClick} color="primary" style={{ marginTop: ".5rem" }}>
                Close
              </Button>
            </DialogActions>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            {crypto === "btc" ? (
              <Fragment>
                <Box className={classes.x} style={{ position: "fixed" }}>
                  <Button onClick={() => setCrypto(null)} color="primary">
                    Back
                  </Button>
                </Box>
                <Bitcoin />
              </Fragment>
            ) : crypto === "ltc" ? (
              <Fragment>
                <Box className={classes.x} style={{ position: "fixed" }}>
                  <Button onClick={() => setCrypto(null)} color="primary">
                    Back
                  </Button>
                </Box>
                <Litecoin />
              </Fragment>
            ) : crypto === "kinguin" ? (
              <Fragment>
                <Box className={classes.x}>
                  <Button onClick={() => setCrypto(null)} color="primary">
                    Back
                  </Button>
                </Box>
                <Kinguin />
              </Fragment>
            ) : null}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Deposit;
