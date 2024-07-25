import React from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ChatIcon from "@material-ui/icons/Chat";

// Assets
import cup from "../assets/cup.png";
import spin from "../assets/roll.png";
import crash from "../assets/crash.png";
import slots from "../assets/slots.png";


const useStyles = makeStyles(theme => ({
  root: {
    background: "#1A1D20",
    display: "flex",
    width: "85%",
    boxShadow: "none",
    padding: "1rem 1rem",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "83%",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  },
  menu: {
    color: "#424863",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
    },
  },
  active: {
    "& > button": {
      height: "3rem",
      width: "5rem",
      backgroundColor: "#2C3034",
      borderColor: "#2C3034",
      color: "white",
      transform: "",
      marginRight: 20,
      "& img": {
        opacity: "1 !important",
      },
    },
  },
  reverse: {
    transform: "",
    textTransform: "capitalize",
    display: "flex",
    "& .crash": {
      height: 35,
    },
  },
  notactive: {
    textDecoration: "none",
    "& > button": {
      width: "5rem",
      height: "3rem",
      borderColor: "#1F2225",
      color: "#1F2225",
      transform: "",
      marginRight: 20,
      [theme.breakpoints.down("sm")]: {
        width: "4rem",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "",
      },
    },
  },
  balance: {
    display: "flex",
    flexDirection: "column",
    background: "#111427",
    transform: "",
    marginLeft: "auto",
    padding: "0.5rem 5rem 0.5rem 1.5rem",
    borderRadius: "0.25rem",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& span": {
      color: "#4c4f61",
      textTransform: "uppercase",
      fontSize: 8,
    },
  },
  price: {
    fontSize: 15,
  },
  plus: {
    position: "absolute",
    background: "#84C46D",
    padding: "0.25rem 0.3rem",
    right: "-1rem",
    top: "0.75rem",
    minWidth: 30,
    "&:hover": {
      background: "#59ba6e",
    },
    "& span": {
      color: "white",
    },
  },
  pfp: {
    transform: "",
    marginLeft: "2rem",
    background: "#181B2B",
    padding: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
    },
  },
  controls: {
    marginTop: 20,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
  },
  create: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
    color: "white",
    transform: "",
    marginRight: 20,
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    transform: "",
    marginRight: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    transform: "",
  },
  modal: {
    "& div > div": {
      background: "#1F2225",
      color: "#fff",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  desktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  mobileNav: {
    display: "none",
    justifyContent: "space-between",
    position: "fixed",
    bottom: 0,
    zIndex: 10000,
    background: "#1A1D20",
    width: "100%",
    padding: 20,
    overflow: "visible",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  chat: {
    position: "absolute",
    bottom: "1.25rem",
    left: "1rem",
    color: "white",
    background: "#1F2225",
    "&:focus": {
      background: "#1F2225",
    },
  },
}));

const MobileNav = ({ mobileChat, setMobile }) => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.mobileNav}>
      <Box className={classes.notactive}>
        <Button
          onClick={() => setMobile(!mobileChat)}
          size="large"
          color="primary"
          variant="outlined"
        >
          <span className={classes.reverse}>
            <ChatIcon style={{ color: "white" }} />
          </span>
        </Button>
      </Box>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/crash"
      >
        <Button size="large" color="primary" >
          <span className={classes.reverse}>
            <img className="crash" src={crash} alt="crash" height="35"/>
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/roulette"
      >
        <Button size="large" color="primary">
          <span className={classes.reverse}>
            <img src={spin} alt="spin" />
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/slots"
      >
        <Button size="large" color="primary" >
          <span className={classes.reverse}>
            <img src={slots} alt="slots" height="75"/>
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/cups"
      >
        <Button size="large" color="primary" >
          <span className={classes.reverse}>
            <img src={cup} alt="cup" />
          </span>
        </Button>
      </Link>
    </Box>
  );
};

export default MobileNav;
