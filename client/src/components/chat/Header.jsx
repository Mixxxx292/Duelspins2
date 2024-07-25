import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

//assets
import logo from "../../assets/logo-wide.png";

const useStyles = makeStyles({
  root: {
    background: "#1F2225",
    // background: "#131522",
    display: "flex",
    height: "7.5rem",
    justifyContent: "center", // Horizontally center the logo
    alignItems: "center", // Vertically center the logo
  },
  logo: {
    maxWidth: "80%", // Set the maximum width of the logo to 100%
    maxHeight: "80%", // Set the maximum height of the logo to 100%
  },
});



const Messages = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <img src={logo} alt="logo" className={classes.logo} />
    </Box>
  );
};

export default Messages;
