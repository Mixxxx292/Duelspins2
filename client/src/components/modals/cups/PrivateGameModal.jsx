import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// Custom Styles
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

const PrivateGameModal = ({ open, handleClose, link }) => {
  // Declare State
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Private Game Created!
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="Invite Link"
            inputProps={{ readOnly: false, "aria-readonly": false }}
            value={link || ""}
          />
          <CopyToClipboard text={link || ""} onCopy={() => setCopied(true)}>
            <Button className="saveBtn" variant="contained">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </CopyToClipboard>
        </Box>
        <h4 className={classes.vipDesc}>
          You've created private cups game, it will not be listed in the public
          games list. Share this link to people you want to invite!
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

PrivateGameModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default PrivateGameModal;
