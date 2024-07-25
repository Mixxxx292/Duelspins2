import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#1F2225",
      color: "#fff",
    },
  },
});

const Help = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Help Model
      </DialogTitle>
      <DialogContent dividers>
        <b>How "Wheel" works:</b>
        <p>
          1. Place the amount you'd like to bet on any multiplier
          <br />
          2. If the spinner lands on 7x everything will be multiplied by 7
          <br />
          3. If the spinner lands on the "cup" a random multiplier will be
          chosen from 2x to 4x
        </p>
        <b>How "Cups" work:</b>
        <p>
          1. Choose the number of players, from 2-4
          <br />
          2. Pick the color of your cup
          <br />
          3. The amount you'd like to bet
          <br />
          4. Once all players have participated in the game, a random cup will
          have a ball underneath it that determines the winner.
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Help;
