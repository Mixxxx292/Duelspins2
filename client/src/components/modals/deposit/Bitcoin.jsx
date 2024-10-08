import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserCryptoInformation } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    margin: 25,
    padding: "1rem",
    color: "white",
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
      "& > div > input": {
        transform: "",
      },
    },
    "& > div > div": {
      background: "#151515 !important",
    },
  },
  value: {
    position: "relative",
    width: "100%",
    color: "white",
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
  Depvalue: {
    position: "relative",
    // width: "75%",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      color: "white",
      "& > div": {
        background: "#151515 !important",
        color: "white",
      },
      "& > div > input": {
        transform: "",
        color: "white",
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
      marginRight: "0.65rem"
    },
  },
  withdraw: {
    color: "white",
    backgroundColor: "#2C3034 !important",
    width: "100%",
    marginTop: "1rem",
    transform: "",
    height: "3rem",
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

const Bitcoin = () => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [copied, setCopied] = useState(false);

  // componentDidMount
  useEffect(() => {
    // Fetch crypto information from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCryptoInformation();

        // Update state
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while fetching user crypto information:",
          error
        );

        // If this was user generated error
        if (error.response && error.response.status === 400) {
          addToast(error.response.data.error, { appearance: "error" });
        } else {
          addToast(
            "There was an error while fetching your crypto deposit information. Please try again later!",
            { appearance: "error" }
          );
        }
      }
    };

    fetchData();
  }, [addToast]);

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            <Box>
              Send your desired amount of Bitcoin (BTC) to the following
              address.
              <br />
              You will be credited after 1 confirmation.
            </Box>
            {loading ? (
              <Skeleton
                height={56}
                width={504}
                animation="wave"
                variant="rect"
              />
            ) : (
              <Box className={classes.Depvalue}>
                <TextField
                  label="Bitcoin Deposit Address"
                  variant="outlined"
                  color="#1F2225"
                  value={cryptoData?.btc?.address}
                />
                <CopyToClipboard
                  text={cryptoData?.btc?.address}
                  onCopy={() => setCopied(true)}
                >
                  <Button>{copied ? "COPIED!" : "COPY"}</Button>
                </CopyToClipboard>
              </Box>
            )}
          </Box>
          {loading ? (
            <Skeleton
              height={140}
              width={140}
              animation="wave"
              variant="rect"
              style={{ marginLeft: "2em" }}
            />
          ) : (
            <img
              className={classes.qrcopy}
              src={cryptoData?.btc?.dataUrl}
              alt="QR Code"
            />
          )}
        </Box>
      </Fragment>
    </Box>
  );
};

export default Bitcoin;
