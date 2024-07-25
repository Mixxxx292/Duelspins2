import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Link as NavLink } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

// Components
import ChatRulesModal from "./modals/ChatRulesModal";
import FaqModal from "./modals/FaqModal";

// Assets
import logo from "../assets/logo.png";
import cards from "../assets/cards.png";
import age from "../assets/18.png";

const useStyles = makeStyles(theme => ({
  root: {
    // background: "#151b44",
    background: "#1F2225",
    display: "flex",
    height: "12rem",
    alignItems: "center",
    "& > div": {
      display: "flex",
      "& > div": {
        width: "100%",
        textAlign: "right",
        display: "flex",
        [theme.breakpoints.down("xs")]: {
          textAlign: "center",
        },
        "& :nth-child(1)": {
          color: "white",
        },
        "& > a": {
          color: "#FFF",
          cursor: "pointer",
          textDecoration: "none",
        },
        "& > a:hover": {
          textDecoration: "none",
          outline: "none",
        },
      },
    },
  },
  list: {
    flexDirection: "column",
    "& :nth-child(1)": {
      marginBottom: "1.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      "&:nth-child(5)": {
        display: "none",
      },
    },
  },
  logo: {
    height: "5rem !important",
    [theme.breakpoints.down("xs")]: {
      display: "none !important",
    },
    "& img": {
      // height: "3rem",
      height: "6rem",
      width: "auto",
      marginRight: "15rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  endRoot: {
    background: "#1A1D20",
    // background: "#141724",
    color: "#fff",
    display: "flex",
    height: "5rem",
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      display: "flex",
    },
    "& .left": {
      display: "flex",
      flexDirection: "column",
    },
    "& .right": {
      display: "flex",
      marginLeft: "auto",
      alignItems: "center",
      "& img": {
        marginLeft: "1rem",
        opacity: 0.5,
      },
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [faqModalVisible, setFaqModalVisible] = useState(false);

  return (
    <Box>
      <Box className={classes.root}>
        <Container>
          <Box className={classes.logo}>
            <img src={logo} alt="logo" />
          </Box>
          <Box className={classes.list}>
            <Box>About</Box>
            <NavLink to="/terms">Terms of Service</NavLink>
            <NavLink to="/fair">Provably Fair</NavLink>
            <ChatRulesModal
              open={modalVisible}
              handleClose={() => setModalVisible(state => !state)}
            />
            <Link onClick={() => setModalVisible(state => !state)}>
              Chat Rules
            </Link>
          </Box>
          <Box className={classes.list}>
            <Box>Help</Box>
            <Link onClick={() => window.Tawk_API && window.Tawk_API.toggle()}>
              Live Support
            </Link>
            <FaqModal
              open={faqModalVisible}
              handleClose={() => setFaqModalVisible(state => !state)}
            />
            <Link onClick={() => setFaqModalVisible(state => !state)}>FAQ</Link>
            <Link href="support@moonbet.vip" target="blank_">
              E-mail
            </Link>
          </Box>
          <Box className={classes.list}>
            <Box>Social</Box>
            <Link href="https://twitter.com/moonbetvip" target="blank_">
              Twitter
            </Link>
            <Link href="https://discord.gg/moonbet" target="blank_">
              Discord
            </Link>
          </Box>
          <Box className={classes.list}>
            <Box>Payments</Box>
            <Box flexDirection="row">
              <img src={cards} alt="cards" />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box className={classes.endRoot}>
        <Container>
          <Box className="left">
            <span>{new Date().getFullYear()} Moonbet</span>
            <span>All Rights Reserved</span>
          </Box>

          <Box className="right">
            <a
              href="https://www.begambleaware.org/"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <Box className="right">
                Gambling can be addictive
                <img src={age} alt="age" />
              </Box>
            </a>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
