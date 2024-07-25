import React from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";


// MUI Components
import Box from "@material-ui/core/Box";

// Custom Styled Componen
/*const Cup = withStyles({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    display: "flex",
    width: "17.7vw",
    minWidth: 225,
    maxWidth: 390,
    justifyContent: "center",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      left: "50%",
      bottom: "-18px",
      transform: "translateX(-50%)",
      width: "80%",
      height: "20px",
      backgroundColor: "#4263cb",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      zIndex: -1,
      transition: "background-color 0.2s linear",
    },
    "& .mid": {
      width: "100%",
      height: "17.2vw",
      minHeight: 215,
      maxHeight: 380,
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
      backgroundColor: "rgba(52, 113, 255, 0.6)",
      overflow: "hidden",
      transition: "background-color 0.2s linear",
      "& .shade": {
        position: "absolute",
        left: "-40px",
        top: 0,
        width: "calc(85% + 40px)",
        height: 330,
        clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
        backgroundColor: "rgba(77, 121, 255, 0.15)",
        transition: "background-color 0.2s linear",
        "&::after": {
          content: "''",
          position: "absolute",
          left: "0",
          bottom: "-20px",
          width: "100%",
          height: "20px",
          backgroundColor: "#4263cb",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          transition: "background-color 0.2s linear",
        },
      },
      "& .water": {
        position: "absolute",
        bottom: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        transition: "height 0.4s linear",
        "& div": {
          position: "absolute",
          bottom: "15%",
          left: "50%",
          marginLeft: -500,
          marginBottom: -1025,
          width: 1000,
          height: 1025,
          borderRadius: "40%",
          backgroundColor: "#4263cb",
          zIndex: -1,
          transition: "background-color 0.2s linear, bottom 1s linear",
          animation: "$water 15s linear infinite",
        },
      },
    },
    "& .topBar": {
      position: "absolute",
      height: 15,
      width: "85%",
      left: "50%",
      top: 25,
      backgroundColor: "rgba(39, 66, 150, 0.55)",
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      transition: "background-color 0.2s linear",
    },
    "& .midBar": {
      position: "absolute",
      height: 15,
      width: "72.5%",
      left: "50%",
      top: 50,
      backgroundColor: "rgba(39, 66, 150, 0.55)",
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      transition: "background-color 0.2s linear",
    },
    "& .bottomBar": {
      position: "absolute",
      height: 15,
      width: "45%",
      left: "50%",
      bottom: -15,
      backgroundColor: "rgba(39, 66, 150, 0.55)",
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      zIndex: 1,
      transition: "background-color 0.2s linear",
    },
    "& .top": {
      position: "absolute",
      height: 25,
      width: "19.3vw",
      minWidth: 255,
      maxWidth: 420,
      left: "50%",
      top: -25,
      backgroundColor: "#e3e3e3",
      transform: "translateX(-50%)",
      borderRadius: 30,
      "&::before": {
        content: "''",
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "92.5%",
        height: "100%",
        backgroundColor: "#F4F4F4",
        borderRadius: 30,
      },
    },
    "&.crashed": {
      "&::after": {
        backgroundColor: "#ff7b7b",
      },

      "& .mid": {
        backgroundColor: "rgba(255, 69, 69, 0.6)",

        "& .shade": {
          backgroundColor: "rgba(255, 77, 77, 0.15)",
        },

        "& .water": {
          "& div": {
            backgroundColor: "#ff7b7b",
          },
        },
      },
      "& .topBar": {
        backgroundColor: "rgba(142, 54, 54, 0.55)",
      },
      "& .midBar": {
        backgroundColor: "rgba(142, 54, 54, 0.55)",
      },
      "& .bottomBar": {
        backgroundColor: "rgba(142, 54, 54, 0.55)",
      },
    },
  },
  "@keyframes water": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
})(Box);*/

const Moon = withStyles({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    display: "flex",
    width: "30vw",
    minWidth: 250,
    maxWidth: 225,
    height: "30vw",
    minHeight: 250,
    maxHeight: 225,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    backgroundColor: "#F7EED6",                     
    boxShadow: "0px 0px 60px rgba(255, 255, 255, 0.8)",
    "&::after": {
      content: "''",
      position: "absolute",
      left: "-10%",
      top: "-10%",
      width: "120%",
      height: "120%",
      borderRadius: "50%",
      backgroundColor: "#F7EED6",
      opacity: 0.5,
    },
    "& .crater": {
      backgroundColor: "#7a706f",
      height: "30px",
      width: "30px",
      borderRadius: "50%",
      position: "relative",
      boxShadow: "inset -5px 0 0 2px #1F2225",
    },
    "& .crater-1": {
      position: "absolute",
      top: "25%",
      left: "15%",
      transform: "scale(1.18)",
    },
    "& .crater-2": {
      position: "absolute",
      top: "50%",
      left: "75%",
      transform: "scale(0.65)",
    },
    "& .crater-3": {
      position: "absolute",
      top: "10%",
      left: "45%",
      transform: "scale(0.9)",
    },
    "& .crater-4": {
      position: "absolute",
      top: "60%",
      left: "40%",
      transform: "scale(0.6)",
    },
    "& .crater-5": {
      position: "absolute",
      top: "70%",
      left: "15%",
      transform: "scale(0.75)",
    },
    "& .crater-6": {
      position: "absolute",
      top: "75%",
      left: "65%",
      transform: "scale(0.89)",
    },
    "& .crater-7": {
      position: "absolute",
      top: "30%",
      left: "60%",
      transform: "scale(0.8)",
    },
    "& .shadow": {
        height: "225px",
        width: "225px",
        boxShadow: "25px 10px 0 5px rgba(0,0,0,0.18)",
        borderRadius: "50%",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)",
    },
    "&.crashed": {
      root: {
        backgroundColor: "#ff7b7b",
      },
      "&.crater": {
        backgroundColor: "#ff7b7b",
      },
      "&::after": {
        backgroundColor: "#ff7b7b",
      },
    },
  },
  
})(Box);

const Orbit = withStyles({
  root: {
    height: "370px",
    width: "370px",
    position: "absolute",
    margin: "auto",
    "& .orbit": {
      height: 375,
      width: 375,
      borderRadius: "50%",
      position: "absolute",
      margin: "auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      animation: "$spin 5s infinite linear",
    },
    "&.crashed": {

    },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "50%": {
      transform: "rotate(180deg)",
    },
    "100%": {
        transform: "rotate(360deg)",
    },
  },
})(Box);

const Rocket = withStyles({
  root: {
    "& .rocket": {
      backgroundColor: "#A8A498",
      height: "50px",
      width: "25px",
      borderRadius: "50% 50% 0 0",
      position: "relative",
      left: "-11px",
      top: "115px",
      zIndex: 2,
      transform: "rotate(15.5deg)",
        "& .wing": {
          position: "absolute",
          content: "",
          background: "#A8A498",
          height: "20px",
          width: "55px",
          zIndex: -1,
          borderRadius: "50% 50% 0 0",
          right: "-15px",
          bottom: 0,
      },
      "& .wing2": {
          position: "absolute",
          content: "",
          background: "#A8A498",
          height: "4px",
          width: "15px",
          borderRadius: "0 0 2px 2px",
          bottom: "-4px",
          left: "4.3px",
          zIndex: -1,
      },
      "& .window": {
          height: "10px",
          width: "10px",
          backgroundColor: "#151845",
          border: "2px solid #b8d2ec",
          borderRadius: "50%",
          position: "relative",
          top: "12px",
          left: "7px",
      },
      "& .flames": {
        position: "absolute",
        bottom: "-12px",
        left: "50%",
        marginLeft: "-9px",
        width: "0",
        height: "0",
        borderStyle: "solid",
        borderWidth: "9px 8px 0 7.5px",
        borderColor: "#ff9900 transparent transparent transparent",
        animation: "$flames 1s ease-in-out infinite",
        zIndex: -2,
      },
    },
  },
  "@keyframes flames": {
    "0%": {
      opacity: 0.6,
      transform: "scale(0.8)",
    },
    "50%": {
      opacity: 0.9,
      transform: "scale(1.1)",
    },
    "100%": {
      opacity: 0.7,
      transform: "scale(1)",
    },
  },
})(Box);


const useStyles = makeStyles({
  meta: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    textAlign: "center",
  },
  payout: {
    color: "#A8A498",
    fontSize: "3.125rem",
    fontWeight: "700",
    userSelect: "none",
    lineHeight: 1,

  },
  profit: {
    color: "#A8A498",
    fontSize: "1.85rem",
    fontWeight: "600",
    userSelect: "none",
    lineHeight: 1,
    marginTop: 3,
    transition: "color 0.4s ease",
    "&.cashed": {
      color: "#6afe43",
    },
  },
});

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};


/*
          <div className="water">
              <div
                style={{
                  bottom:
                    gameState === GAME_STATES.InProgress
                      ? `${(payout / 100) * 95 + 15}%`
                      : "15%",
                }}
              ></div>
          </div>
          <Orbit>
          <div className="orbit">
            <Rocket>
              <div className="rocket">
                <div className="window" />
                <div className="wing" />
                <div className="wing2" />
                <div className="flames" />
              </div>
            </Rocket>
          </div>
        </Orbit>
*/

const CupAnimation = ({ loading, payout, ownBet, gameState }) => {
  const classes = useStyles();

  return (
    <span
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Moon className={`${gameState === GAME_STATES.Over ? "crashed" : "running"}`}>

        <div className="moon">
            <div className="crater crater-1"></div>
            <div className="crater crater-2"></div>
            <div className="crater crater-3"></div>
            <div className="crater crater-4"></div>
            <div className="crater crater-5"></div>
            <div className="crater crater-6"></div>
            <div className="crater crater-7"></div>
            <div className="shadow"></div>
        </div>

        <Orbit className={`${gameState === GAME_STATES.Over ? "crashed" : "running"}`}>
          <div className="orbit" >
            <Rocket>
                <div className="rocket">
                  <div className="window" />
                  <div className="wing" />
                  <div className="wing2" />
                  <div className="flames" />
                </div>
              </Rocket>
          </div>
        </Orbit>
        
      </Moon>

      <div className={classes.meta}>
        <div className={classes.payout}>
          {loading ? "Loading" : `${payout.toFixed(2)}x`}
        </div>
        {(gameState === GAME_STATES.InProgress ||
          gameState === GAME_STATES.Over) &&
          ownBet && (
            <div
              className={`${classes.profit} ${
                ownBet.status === BET_STATES.CashedOut ? "cashed" : ""
              }`}
            >
              +$
              {ownBet.status === BET_STATES.Playing
                ? parseCommasToThousands(
                    cutDecimalPoints((ownBet.betAmount * payout).toFixed(7))
                  )
                : parseCommasToThousands(
                    cutDecimalPoints(ownBet.winningAmount.toFixed(7))
                  )}
            </div>
          )}
      </div>
    </span>
  );
};

export default CupAnimation;