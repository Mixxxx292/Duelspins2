import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getSlotsData, getSlotsURL } from "../services/api.service";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";

// Icons
import { Search as SearchIcon } from "@material-ui/icons";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import InfoIcon from '@material-ui/icons/Info';
import FireIcon from "@material-ui/icons/Whatshot";
import Typography from "@material-ui/core/Typography";


// Components
import Preloader from "../Preloader";

// Assets


const useStyles = makeStyles(theme => ({
  loading: {
    margin: "25% 25% 25% 25%"
  },
  logo: {
    marginLeft: "5%",
    fontSize: "2rem",
    color: "white",
    fontFamily: "Lato",
    letterSpacing: 2,
    marginTop: "5%",
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
  },
  searchContainer: {
    marginBottom: "1%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    maxWidth: "30%",
    justifyContent: "center",
    marginLeft: "35%",
  },
  searchInput: {
    width: "100%",
    padding: "8px 16px",
    border: "none",
    borderRadius: 8,
    backgroundColor: "#25282C",
    color: "#fff",
    transition: "box-shadow 0.5s",
    //transition: "transform 0.5s",
    outline: "none", // Remove the outline style when the search bar is focused
    "&:hover": {
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.25)", // Update the box shadow on hover
      transform: "scale(1.01)", // Update the scale on hover
      outline: "none", // Remove the outline style when the search bar is focused
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        height: "2px",
        backgroundColor: "#ffffff",
        opacity: 0,
        animation: "$glow 1s ease-in-out infinite",   
        outline: "none", // Remove the outline style when the search bar is focused   
      },
      "&:focus": {
        outline: "none", // Remove the outline style when the search bar is focused
      },
    },
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    color: "#555",
    cursor: "pointer",
  },
  container: {
    height: "100%",
    width: "100%",  
    marginLeft: "3%"
  },
  box: {
    height: "30%",
    width: "15%",
    position: "relative",
    display: "inline-block",
    backgroundColor: "#25282C",
    textAlign: "center",
    cursor: "pointer",   
    marginRight: 5,
    marginBottom: 10,
    marginLeft: 5,
    borderRadius: "10px",      
    transition: "box-shadow 0.3s, transform 0.3s", // Add transition properties
    "&:hover": {
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.25)", // Update the box shadow on hover
      transform: "scale(1.025)", // Update the scale on hover
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        height: "2px",
        backgroundColor: "#ffffff",
        opacity: 0,
        animation: "$glow 1s ease-in-out infinite",      
      },
    },
    "@media (max-width: 1200px)": {
      width: "12%",
    },
    "@media (max-width: 992px)": {
      width: "15%",
    },
    "@media (max-width: 768px)": {
      width: "20%",
    },
    "@media (max-width: 480px)": {
      width: "25%",
    },                                       
  },
  "@keyframes glow": {
    "0%": {
      opacity: 1,
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.4)",
    },
    "50%": {
      opacity: 1,
      boxShadow: "0px 0px 10px 0px rgba(255, 255, 255, 1)",
    },
    "100%": {
      opacity: 1,
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.4)",
    },
  },
  content: {
    position: "aboslute",
    zIndex: 1,
  },
  thumbnail: {
    display: "relative",
    width: "100%",
    height: "66%",
    marginBottom: 5,
    borderRadius: "10px"
  },
  name: {
    marginBottom: "5px",
    color: "#fff",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 768px)": {
      fontSize: "0.7rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.6rem",
    },
  },
  provider: {
    fontSize: "0.55rem",
    marginBottom: "10px",
    color: "#4c4f61",
    paddingBottom: 5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 768px)": {
      fontSize: "0.47rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.35rem",
    },
  },
  slotBox: {
    width: "80%",
    height: "35.56%", // Adjust the height as needed
    margin: "20px auto", // Center the slotBox horizontally
    position: "relative",
    display: "flex",
    justifyContent: "center", // Center the iframe horizontally
    alignItems: "center", // Center the iframe vertically
    marginTop: "5%",
    marginLeft: "10%",
  },
  slotFrame: {
    width: "100%",
    height: "calc(90vh - 80px)", // Adjust the height as needed
    borderRadius: "10px 10px 10px 10px", // Add border radius to the top corners of the iframe
    border: "none", // Remove the border property
  },
  panel: {
    position: "absolute",
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center", // Horizontally center the buttons
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#25282C",
    color: "#fff",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  topPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center", // Horizontally center the buttons
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#25282C",
    color: "#fff",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    fontSize: "1rem",

  },
  fullscreenButton: {
    marginRight: "22.5%", // Adjust the spacing between buttons if needed
    cursor: "pointer",
  },
  infoButton: {
    marginLeft: "22.5%", // Adjust the spacing between buttons if needed
    cursor: "pointer",
  },
  slotName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Horizontally center the buttons
    width: "50%"
  },
  popularContainer: {
    position: "relative",
    marginBottom: "2.5%",
    padding: "15px",
    border: "2px solid red",
    boxShadow: "0px 0px 20px 0px rgba(255, 0, 0, 0.5), inset 0px 0px 20px 0px rgba(255, 0, 0, 0.5)",
    borderRadius: "10px",
    width: "fit-content",
    height: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
  popularBox: {
    marginTop: "1rem",
    height: "90%",
    width: "30%",
    position: "relative",
    display: "inline-block",
    backgroundColor: "#25282C",
    textAlign: "center",
    cursor: "pointer",   
    marginRight: 5,
    marginBottom: 10,
    marginLeft: 5,
    borderRadius: "10px",      
    transition: "box-shadow 0.3s, transform 0.3s", // Add transition properties
    "&:hover": {
      boxShadow: "0px 0px 5px rgba(255, 0, 0, 0.25)", // Update the box shadow on hover
      transform: "scale(1.025)", // Update the scale on hover
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        height: "2px",
        backgroundColor: "#ffffff",
        opacity: 0,
        animation: "$glow 1s ease-in-out infinite",      
      },
    },
    "@media (max-width: 1200px)": {
      width: "12%",
    },
    "@media (max-width: 992px)": {
      width: "15%",
    },
    "@media (max-width: 768px)": {
      width: "20%",
    },
    "@media (max-width: 480px)": {
      width: "25%",
    },                                 
  },
  popularName: {
    marginBottom: "5px",
    color: "#fff",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 768px)": {
      fontSize: "0.7rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.6rem",
    },
  },
  popularThumbnail: {
    display: "relative",
    width: "100%",
    height: "66%",
    marginBottom: 5,
    borderRadius: "10px"
  },
  popularProvider: {
    fontSize: "0.55rem",
    marginBottom: "10px",
    color: "#4c4f61",
    paddingBottom: 5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 768px)": {
      fontSize: "0.47rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.35rem",
    },
  },
  popularContent: {
    position: "aboslute",
    zIndex: 1,
  },
  popularDescription: {
    fontSize: "0.75rem",
    color: "#888",
  },
  popular1: {
    marginLeft: "2%",
    display: "inline-block",
    transform: "scale(1)",
    "&:hover": {
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.25)", // Update the box shadow on hover
      transform: "scale(1.05)",
    },
  },
  popular2: {
    display: "inline-block",
    marginLeft: "2.75%",
    marginRight: "1.25%",
    transform: "scale(1.1)",
    "&:hover": {
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.25)", // Update the box shadow on hover
      transform: "scale(1.15)",
    },
  },
  popular3: {
    display: "inline-block",
    transform: "scale(0.9)",
    "&:hover": {
      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.25)", // Update the box shadow on hover
      transform: "scale(0.95)",
    },
  },
  popularHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%",
  },
  popularHeaderText: {
    marginLeft: theme.spacing(1),
    color: "red",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
  },
  fireIcon: {
    color: "red",
    textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)"
  },
}));

let ITEM;
const Slots = ({ user, isAuthenticated }) => {  
  const classes = useStyles();

  const { addToast } = useToasts();

  const [games, setGamesData] = useState([]);
  const [gameUrl, setGameUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  // Fetch slots data from API with throttling
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSlotsData();

      // Update state
      setGamesData(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while loading slots data:", error);
      addToast(
        "There was an error while loading slots data!",
        { appearance: "error" }
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFullscreenToggle = () => {
    const iframeElement = document.getElementById('slotFrame');

    // Send message to iframe notifying about fullscreen toggle
    const message = {
      type: 'fullscreenToggle',
      fullscreen: !fullscreen,
    };

    iframeElement.contentWindow.postMessage(message, '*');

    if (!fullscreen) {
      const iframeElement = document.getElementById("slotFrame");
      if (iframeElement.requestFullscreen) {
        iframeElement.requestFullscreen();
      } else if (iframeElement.mozRequestFullScreen) {
        iframeElement.mozRequestFullScreen();
      } else if (iframeElement.webkitRequestFullscreen) {
        iframeElement.webkitRequestFullscreen();
      } else if (iframeElement.msRequestFullscreen) {
        iframeElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  const handleClick = async (item) => {
    ITEM = item;
    // Perform your desired action with the clicked item
    const gameURL = await getSlotsURL(item, user);

    setGameUrl(gameURL);
    setGame(false);

    window.addEventListener('message', handleIframeMessage, false);
  };

  const handleIframeMessage = (event) => {
    if (event.data && event.data.type === 'iframeHeight' && event.data.height) {
      const iframeElement = document.getElementById('slotFrame');
      iframeElement.style.height = event.data.height + 'px';
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const windowEvents = (event) => {
    window.addEventListener('DOMContentLoaded', () => {
      const iframeHeight = document.body.scrollHeight;
      window.parent.postMessage(
        { type: 'iframeHeight', height: iframeHeight },
        '*'
      );
    });
  }

  const renderBoxes = () => {
    let allBoxes = [];
  
    if (games.length >= 2) {
      const bgamingData = games[0];
      const caletaData = games[1];
      console.log(caletaData)
  
      const bgaming = bgamingData.filter(
        (item) =>
          // item.category === "slots" &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      allBoxes.push(
        bgaming.map((item, i) => (
          <div className={classes.box} key={i} onClick={() => handleClick(item)}>
            <div className={classes.content}>
            <img className={classes.thumbnail} src={`https://cdn.softswiss.net/i/s2/softswiss/${item.identifier}.webp`} alt="Thumbnail" />
              <div className={classes.name}>{item.title}</div>
              <div className={classes.provider}>{item.provider}</div>
            </div>
          </div>
        ))
      );
  
      const caleta = caletaData.filter(
        (item) =>
          item.category === "Video Slots" &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      allBoxes.push(
        caleta.map((item, i) => (
          <div className={classes.box} key={i} onClick={() => handleClick(item)}>
            <div className={classes.content}>
              <img className={classes.thumbnail} src={item.url_thumb} alt="Thumbnail" />
              <div className={classes.name}>{item.name}</div>
              <div className={classes.provider}>{item.product}</div>
            </div>
          </div>
        ))
      );
    }
  
    return allBoxes;
  };  

  const renderPopularSlots = () => {
    let popularBoxes = [];

    if (games.length >= 2) {
      const popularSlots = [games[0][16], games[1][103], games[0][67]];

      popularBoxes.push(popularSlots.map((item, i) => (
        <Box className={`${classes.popularBox} ${classes[`popular${i + 1}`]}`} key={i} onClick={() => handleClick(item)}>
        <img
          className={classes.popularThumbnail}
          src={item?.url_thumb || `https://cdn.softswiss.net/i/s2/softswiss/${item?.identifier}.webp`}
          alt="Thumbnail"
          style={ item?.url_square_thumb ? { width: "100%", height: 150, } : {   width: "100%", height: "66%",}}
        />
        <div className={classes.popularContent}>
          <div>
            <div className={classes.popularName}>{item?.name || item?.title}</div>
          </div>
          <div className={classes.popularProvider}>{item?.product || item?.provider}</div>
        </div>
      </Box>      
      )));
      return popularBoxes;
    }
    return popularBoxes;
  };
  

  const boxes = renderBoxes();
  const popularSlots = renderPopularSlots();

  return (
    <div>
      {loading ? (
        <div className={classes.loading}>
          <Preloader />
        </div>
      ) : game ? (
        <Fragment>
          <div className={classes.container}>
            <Box className={classes.logo}>
              SLOTS & GAMES
            </Box>
            <div className={classes.popularHeader}>
              <FireIcon className={classes.fireIcon} /> {/* Add the fire icon */}
              <Typography variant="h4" className={classes.popularHeaderText}>
                Popular Games
              </Typography>
            </div>
            <div className={classes.popularContainer}>
              {popularSlots}
            </div>
            <div className={classes.searchContainer}>
              <input
                className={classes.searchInput}
                type="text"
                placeholder="Search by game name"
                value={searchTerm}
                onChange={handleSearch}
              />
              <SearchIcon className={classes.searchIcon} />
            </div>
            <div className="grid-container" >{boxes}</div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={classes.slotContainer}>
            <div className={classes.slotBox}>
              <div className={classes.topPanel}>
                <FullscreenIcon
                  className={classes.fullscreenButton}
                  onClick={handleFullscreenToggle}
                />
                  <div className={classes.slotName}>{ITEM?.name || ITEM?.title}</div>
                <InfoIcon className={classes.infoButton} />
              </div>
              <iframe id="slotFrame" className={classes.slotFrame} src={gameUrl}>
                <script src={windowEvents} />
              </iframe>
              {/*<div className={classes.panel}>
                <FullscreenIcon
                  className={classes.fullscreenButton}
                  onClick={handleFullscreenToggle}
                />
                <InfoIcon className={classes.infoButton} />
              </div>*/}
            </div>
          </div>
          
        </Fragment>
      )}
    </div>
  );
};

Slots.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Slots);