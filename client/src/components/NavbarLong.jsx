import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Skeleton from "@material-ui/lab/Skeleton";

// Icons
import walletIcon from "../assets/wallet.png"
// import StarIcon from "@material-ui/icons/Star";

// Modals
import Market from "./modals/MarketModal";
import Help from "./modals/HelpModal";
import Deposit from "./modals/DepositModal";
import Vip from "./modals/VIPModal";
import Coupon from "./modals/CouponModal";
import Free from "./modals/FreeModal";

// Assets
import cup from "../assets/cup.png";
import spin from "../assets/roll.png";
import crash from "../assets/crash.png";
import slots from "../assets/slots.png";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 30,
    background: "#1F2225",
    display: "flex",
    width: "100%",
    boxShadow: "none",
    padding: "1rem 1rem",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
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
    marginLeft: "0rem",
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
    "& .slots": {
      height: 35,
      marginBottom: "0.1rem"
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
  sub: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "3rem",
      borderColor: "#1F2225",
      color: "#fff",
      transform: "",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  free: {
    textDecoration: "none",
    "& > button": {
      width: "7rem",
      height: "3rem",
      color: "#ffd027",
      textShadow: "0px 0px 20px #ffd027",
      transform: "",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  subActive: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "3rem",
      borderColor: "#1F2225",
      color: "#2C3034",
      textShadow: "0px 0px 30px",
      transform: "",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  balance: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1D401E",
    marginLeft: "auto",
    padding: "0rem 0.5rem", // Adjust the padding as needed
    borderRadius: "0.25rem",
    position: "relative",
    fontWeight: 400,
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& .container": {
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      marginRight: "2rem"
    },
    "& .main-rectangle": {
      display: "flex",
      alignItems: "center",
    },
    "& .main-rectangle span": {
      marginLeft: "0.5rem",
    },
    "& .cash-sign": {
      fontSize: "0.8rem",
      // background: "linear-gradient(to top left, #E89624 0%, #A15A09 70%)",
      // color: "#fff",
      WebkitBackgroundClip: "text",
      fontWeight: "bold",
    },
    "& .right-rectangle": {
      display: "flex",
      alignItems: "center",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: "bold",
      backgroundColor: "#225A23",
      padding: "7.5% 5.5% 7.5% 5.5%",
      fontSize: "0.75rem",
      borderRadius: "0 0.25rem 0.25rem 0",
      color: "#40E93D",
      cursor: "pointer",
    },
    "& .img": {
      marginRight: "0rem",
      height: "1rem", // Adjust the height as needed
      order: -1, // Position the icon before the text
      alignItems: "center",
    },
    "& .text": {
      alignItems: "center",
    },
  },
  deposit: {
    opacity: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    background: "#448945",
    marginLeft: "auto",
    padding: "0.75rem 0.5rem 0.75rem 1rem",
    marginRight: "0.5rem",
    borderRadius: "0.25rem",
    position: "relative",
    fontWeight: "bold",
    "& span": {
      color: "#fff",
      fontSize: 13,
      padding: "0.5rem 1rem 0.5rem 1rem",
    },
    "&:hover": {
      textShadow: "0px 0px 10px",
      opacity: 0.85,
    },
    
  },
  // `padding-top`, `padding-right`, `padding-bottom`, and `padding-left`.
  withdraw: {
    opacity: .75,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    background: "#26292D",
    marginLeft: "auto",
    padding: "0.8rem 1rem 0.8rem 1rem",
    borderRadius: "0.25rem",
    position: "relative",
    fontWeight: 600,
    "& span": {
      color: "#fff",
      fontSize: 13,
    },
    "&:hover": {
      textShadow: "0px 0px 10px",
      opacity: 0.85,
    },
  },
  price: {
    fontSize: 15,
    color: "#fff"
  },
  plus: {
    position: "absolute",
    background: "#84C46D",
    padding: "0.25rem 0.3rem",
    minWidth: 30,
    "&:hover": {
      background: "#59ba6e",
    },
    "& span": {
      color: "white",
    },
  },
  pfp: {
    opacity: 0.85,
    transform: "",
    marginLeft: "2.5rem",
    background: "#1F2225",
    padding: "0.25rem",
    borderRadius: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
    },
    "&:hover": {
      imageShadow: "0px 0px 10px",
      opacity: 1
    }
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
    background: "linear-gradient(to bottom right, #15022e 0%, #000000 75%)",
      color: "#fff",
    },
  },
  rightMenu: {
    "& > .MuiPaper-root ": {
      backgroundColor: "#1F2225",
      color: "#fff",
      width: "10rem",
      top: "4rem !important",
      right: "3rem !important",
      left: "auto !important",
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
    display: "flex",
    position: "fixed",
    bottom: 0,
  },
  steam: {
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #081232, #3d3f64)",
    color: "white",
    marginLeft: "auto",
    "&:hover": {
      background: "linear-gradient(45deg, #081232, #3d3f64)",
    },
  },
  google: {
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #1F2225, #4fc5fd)",
    color: "white",
    marginLeft: "1rem",
    "&:hover": {
      background: "linear-gradient(45deg, #1F2225, #4fc5fd)",
    },
  },
  login: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    "& > button": {
      height: 40,
    },
    "& > h5": {
      marginRight: 20,
      fontWeight: 200,
      color: "#454872",
    },
  },
  noLink: {
    textDecoration: "none",
  },
  topBar: {
    position: 'fixed',
    width: '100%',
    background: '#1A1D20',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: '9999',
  },
  textContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: "20px",
  },
  raceText: {
    fontSize: "0.9rem",
    color: "#28FF40",
    marginRight: "2rem",
    cursor: "pointer",
    fontWeight: 450,
    transition: "color 0.3s ease",
    "&::hover": {
      textShadow: "0 0 5px rgba(40, 255, 64, 0.3)"
    },
  },
  text: {
    fontSize: "0.9rem",
    color: "#7D8286",
    marginRight: "2rem",
    cursor: "pointer",
    transition: "color 0.3s ease",
    fontWeight: 400,
    "&::hover": {
      textShadow: "0 0 5px rgba(40, 255, 64, 0.3)"
    },
  },
}));

const Navbar = ({ isAuthenticated, isLoading, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mbAnchorEl, setMbAnchorEl] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const open = Boolean(anchorEl);
  const openMobile = Boolean(mbAnchorEl);

  // If user has clicked affiliate link
  useEffect(() => {
    // Get affiliate code from localStorage
    const storageCode = localStorage.getItem("affiliateCode");

    // If user is logged in
    if (!isLoading && isAuthenticated && storageCode) {
      // Remove item from localStorage
      localStorage.removeItem("affiliateCode");

      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div>
      <div className={classes.topBar}>
        <div className={classes.textContainer}>
        <Link
            exact
            activeClassName={classes.subActive}
            className={classes.sub}
            to="/race">
          <span className={classes.raceText }>Weekly Race</span>
        </Link>
        {isAuthenticated && user && (
          <div>
             <Link
              exact
              activeClassName={classes.subActive}
              className={classes.sub}
              to="/affiliates">
              <span className={classes.text}>Affiliates</span>
            </Link>
            <span className={classes.text} onClick={() => setOpenVip(!openVip)} onClose={() => setAnchorEl(null)} >VIP</span>
            <span className={classes.text} onClick={() => setOpenCoupon(!openCoupon)} onClose={() => setAnchorEl(null)} >Coupon</span>
          </div>
        )}
        <Link               
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/fair">
          <span className={classes.text}>Fairness</span>
        </Link>
        </div>
      </div>
      <AppBar position="static" className={classes.root}>
        <Toolbar variant="dense" className={classes.desktop}>
          <Market
            handleClose={() => setOpenMarket(!openMarket)}
            open={openMarket}
          />
          <Help handleClose={() => setOpenHelp(!openHelp)} open={openHelp} />
          <Deposit
            handleClose={() => setOpenDeposit(!openDeposit)}
            open={openDeposit}
          />
          <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
          <Coupon
            handleClose={() => setOpenCoupon(!openCoupon)}
            open={openCoupon}
          />
          <Free
            handleClose={() => setOpenFree(!openFree)}
            open={openFree}
            code={affiliateCode}
          />

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

          {/*isAuthenticated && user && (
            <span className={classes.sub}>
              <Button
                onClick={() => setOpenMarket(!openMarket)}
                size="small"
                startIcon={<ShoppingCart />}
                color="primary"
              >
                <span className={classes.reverse}>Market</span>
              </Button>
            </span>
          )*/}

          {/*<span className={classes.sub}>
            <Button
              onClick={() => setOpenHelp(!openHelp)}
              size="small"
              startIcon={<ContactSupport />}
              color="primary"
            >
              <span className={classes.reverse}>Help</span>
            </Button>
          </span>*/}

          {/*isAuthenticated && user && (
            <Link
              exact
              activeClassName={classes.subActive}
              className={classes.sub}
              to="/affiliates"
            >
              <Button size="small" startIcon={<ControlCamera />} color="primary">
                <span className={classes.reverse}>Affiliates</span>
              </Button>
            </Link>
          )*/}

          {/*<Link
            exact
            activeClassName={classes.subActive}
            className={classes.sub}
            to="/race"
          >
            <Button size="small" startIcon={<FlashOnIcon />} color="primary">
              <span className={classes.reverse}>Race</span>
            </Button>
          </Link>*/}

          {/* {isAuthenticated && user && (
            <span className={classes.sub}>
              <Button
                onClick={() => setOpenCoupon(!openCoupon)}
                size="small"
                startIcon={<StarIcon />}
                color="primary"
              >
                <span className={classes.reverse}>Coupon</span>
              </Button>
            </span>
          )} */}

          {isLoading ? (
            <div className={classes.login}>
              <Skeleton
                height={36}
                width={120}
                animation="wave"
                variant="rect"
                style={{ marginRight: "1rem" }}
              />
              <Skeleton height={36} width={120} animation="wave" variant="rect" />
            </div>
          ) : isAuthenticated && user ? (
            <div className={classes.login}>
              <Box className={classes.balance}>
                <div className="main-rectangle">
                  <div className="container">
                    <span className="cash-sign"><span role="img" aria-label="cash">💵</span></span>
                    <span>
                      {parseCommasToThousands(cutDecimalPoints(user.wallet.toFixed(7)))}
                    </span>
                  </div>
                  <div className="right-rectangle" onClick={() => setOpenDeposit(!openDeposit)}>
                    <span className="text">WALLET</span>
                    <img className="img" alt="walleticon" src={walletIcon} />
                  </div>
                </div>
              </Box>

              {/*<Box 
                className={classes.deposit} 
                onClick={() => setOpenDeposit(!openDeposit)}
                onClose={() => setAnchorEl(null)}
              >
                <Box  flexDirection="column">
                  <Box className={classes.price}>
                      <svg data-v-2989e9c3="" data-v-2ee14161="" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><rect data-v-2989e9c3="" data-v-2ee14161="" x="4.40002" width="2.2" height="11" rx="1" fill="white"></rect><rect data-v-2989e9c3="" data-v-2ee14161="" y="6.60001" width="2.2" height="11" rx="1" transform="rotate(-90 0 6.60001)" fill="white"></rect></svg>
                      <span>Deposit</span>
                  </Box>
                </Box>
              </Box>

              <Box 
                className={classes.withdraw}
                onClick={() => setOpenMarket(!openMarket)}
                onClose={() => setAnchorEl(null)}
              >
                <Box className={classes.reverse} flexDirection="column">
                    <span>Withdraw</span>
                </Box>
              </Box>*/}

              <Box className={classes.pfp}>
                <Link exact to="/profile">
                  <Avatar variant="rounded" src={user.avatar} />
                </Link>
              </Box>

              <IconButton
                onClick={event => setAnchorEl(event.currentTarget)}
                edge="start"
                className={classes.menu}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                open={open}
                onClose={() => setAnchorEl(null)}
                className={classes.rightMenu}
              >
                <Link exact to="/profile" className={classes.link}>
                  <MenuItem onClose={() => setAnchorEl(null)}>Profile</MenuItem>
                </Link>

                <Link exact to="/history" className={classes.link}>
                  <MenuItem onClose={() => setAnchorEl(null)}>History</MenuItem>
                </Link>

                {/*<Link exact to="/affiliates" className={classes.link}>
                  <MenuItem onClose={() => setAnchorEl(null)}>Affliates</MenuItem>
                </Link>*/}
                
                {/*<MenuItem
                  onClick={() => setOpenCoupon(!openCoupon)}
                  onClose={() => setAnchorEl(null)}
                >
                  Coupon
                </MenuItem>*/}
                {/*<MenuItem
                  onClick={() => setOpenVip(!openVip)}
                  onClose={() => setAnchorEl(null)}
                >
                  VIP
                </MenuItem>*/}
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenFree(!openFree)}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Free  0.50 <span role="img" aria-label="cash">💵</span>
                  </MenuItem>{" "}
                </Box>
                <MenuItem
                  onClick={() => logout()}
                  onClose={() => setAnchorEl(null)}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className={classes.login}>
              <Link to="/login/steam" className={classes.noLink}>
                <Button className={classes.steam} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 20 }}
                    className="fab fa-steam-symbol"
                  ></i>
                  Steam
                </Button>
              </Link>
              <Link to="/login/google" className={classes.noLink}>
                <Button className={classes.google} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 20 }}
                    className="fab fa-google"
                  ></i>
                  Google
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>

        <Toolbar className={classes.mobile}>
          {isLoading ? (
            <div className={classes.login}>
              <Skeleton
                height={36}
                width={120}
                animation="wave"
                variant="rect"
                style={{ marginRight: "1rem" }}
              />
              <Skeleton height={36} width={120} animation="wave" variant="rect" />
            </div>
          ) : isAuthenticated && user ? (
            <div style={{ display: "flex", width: "100%" }}>
              <Box className={classes.balance}>
                <div className="main-rectangle">
                  <div className="container">
                    <span className="cash-sign"><span role="img" aria-label="cash">💵</span></span>
                    <span>
                      {parseCommasToThousands(cutDecimalPoints(user.wallet.toFixed(7)))}
                    </span>
                  </div>
                  <div className="right-rectangle" onClick={() => setOpenDeposit(!openDeposit)}>
                    <span className="text">WALLET</span>
                    <img className="img" alt="walleticon" src={walletIcon} />
                  </div>
                </div>
              </Box>
              <IconButton
                onClick={event => setMbAnchorEl(event.currentTarget)}
                edge="start"
                className={classes.menu}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Box className={classes.pfp}>
                <Link exact to="/profile">
                  <Avatar variant="rounded" src={user.avatar} />
                </Link>
              </Box>
              <Menu
                open={openMobile}
                onClose={() => setMbAnchorEl(null)}
                className={classes.rightMenu}
              >
                <Link exact to="/profile" className={classes.link}>
                  {" "}
                  <MenuItem onClose={() => setMbAnchorEl(null)}>
                    Profile
                  </MenuItem>{" "}
                </Link>
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenVip(!openVip)}
                    onClose={() => setAnchorEl(null)}
                  >
                    VIP
                  </MenuItem>{" "}
                </Box>
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenMarket(!openMarket)}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Market
                  </MenuItem>{" "}
                </Box>
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenHelp(!openHelp)}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Help
                  </MenuItem>{" "}
                </Box>
                <Link exact to="/affiliates" className={classes.link}>
                  {" "}
                  <MenuItem onClose={() => setMbAnchorEl(null)}>
                    Affiliates
                  </MenuItem>{" "}
                </Link>
                <Link exact to="/race" className={classes.link}>
                  {" "}
                  <MenuItem onClose={() => setMbAnchorEl(null)}>
                    Race
                  </MenuItem>{" "}
                </Link>
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenCoupon(!openCoupon)}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Coupon
                  </MenuItem>{" "}
                </Box>
                <Link exact to="/logout" className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => logout()}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Logout
                  </MenuItem>{" "}
                </Link>
                <Box className={classes.link}>
                  {" "}
                  <MenuItem
                    onClick={() => setOpenFree(!openFree)}
                    onClose={() => setMbAnchorEl(null)}
                  >
                    Free <span role="img" aria-label="cash">💵</span>
                  </MenuItem>{" "}
                </Box>
              </Menu>
            </div>
          ) : (
            <div className={classes.login}>
              <Link to="/login/steam" className={classes.noLink}>
                <Button className={classes.steam} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 20 }}
                    className="fab fa-steam-symbol"
                  ></i>
                  Steam
                </Button>
              </Link>
              <Link to="/login/google" className={classes.noLink}>
                <Button className={classes.google} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 20 }}
                    className="fab fa-google"
                  ></i>
                  Google
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
