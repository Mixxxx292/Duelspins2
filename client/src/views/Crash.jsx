import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getCrashSchema, getUserCrashData } from "../services/api.service";
import { crashSocket } from "../services/websocket.service";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import _ from "underscore";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import InfoIcon from "@material-ui/icons/Info";
import CasinoIcon from "@material-ui/icons/Casino";

// Components
import Bets from "../components/crash/Bets";
import Cup from "../components/crash/Cup";
import HistoryEntry from "../components/crash/HistoryEntry";

// Assets
import timer from "../assets/timer.png";

// Custom Styled Component
const BetInput = withStyles({
  root: {
    transform: "",
    marginRight: 10,
    maxWidth: 130,
    minWidth: 100,
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
      transform: "",
    },
    "& div input": {
      color: "#fff",
      padding: "0.5rem 0.25rem",
      transform: "",
    },
    "& div": {
      backgroundColor: "#2C3034",
      background: "#1e234a",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

/*const TargetInput = withStyles({
  root: {
    marginTop: "auto",
    transform: "",
    marginRight: 10,
    marginLeft: 10,
    maxWidth: 120,
    minWidth: 100,
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
      transform: "",
    },
    "& div input": {
      backgroundColor: "#2C3034",
      color: "#fff",
      padding: "0.5rem 0.25rem",
      transform: "",
    },
    "& div": {
      // background: "#2C3034",
      background: "#2C3034",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);*/

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    paddingTop: 25,
    paddingBottom: 120,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
    },
    "& > div > div": {
      justifyContent: "space-around",
    },
  },
  container: {
    maxWidth: 1500,
  },
  logo: {
    fontSize: 25,
    color: "white",
    fontFamily: "Lato",
    letterSpacing: 2,
    marginTop: "3rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
      marginTop: 5,
    },
  },
  countdown: {
    fontSize: 15,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  controls: {
    overflow: "visible",
    background: "linear-gradient(to left right, #2C3034 0%, #000000 70%)",
    padding: "1rem 3rem",
    paddingTop: 0,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "5.5rem",
    maxWidth: "60rem",
    alignItems: "center",
    justifyContent: "flex-end",
    maskImage: "linear-gradient(240deg,rgba(0,0,0,1) 34%,rgba(0,0,0,0))",
  },
  game: {
    display: "flex",
    width: "56%",
    height: "75vh",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      width: "100%",
    },
  },
  cup: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 400,
    margin: "auto",
    position: "relative",
    overflow: "hidden",
    background: "#1F2225",
    borderRadius: 5,
    transition: "1s ease",
  },
  gameInfo: {
    position: "absolute",
    top: 7.5,
    left: 10,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 700,
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  maxProfit: {
    opacity: 0.6,
    position: "absolute",
    top: 7.5,
    right: 10,
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  placeBet: {
    background: "#1F2225",
    borderRadius: 5,
    marginTop: "0.5rem",
    "& button": {
      color: "white",
      fontSize: 15,
      transition: "0.25s ease",
      opacity: 0.75,
      "&:hover": {
        textShadow: "0px 0px 10px",
        opacity: 1,
      },
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#FFFFFF",
    background: "transparent !important",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    padding: "1rem 1.25rem 0",
    lineHeight: 1,
  },
  splitTitle: {
    display: "inline-block",
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    padding: "1rem 1.25rem 0",
    lineHeight: 1,
    width: "50%",
  },
  contain: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  multiplier: {
    minWidth: "fit-content",
    backgroundColor: "#2C3034",
    borderColor: "#2C3034",
    color: "white",
    marginRight: 10,
    marginBottom: "0.5rem",
    marginTop: "0.5rem",
    paddingTop: 5,
    paddingBottom: 5,
    "&:hover": {
      backgroundColor: "#2C3034",
    },
  },
  betCont: {
    display: "flex",
    width: "95%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "auto",
    padding: "0.5rem 0 0",
    borderRadius: 5,
  },
  cashoutCont: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  autoCont: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  bet: {
    minWidth: "fit-content",
    backgroundColor: "#3CC65D",
    borderColor: "#FF4D4D",
    color: "white",
    transform: "",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#3CC65D",
    },
  },
  cashout: {
    minWidth: "fit-content",
    backgroundColor: "#F53737",
    borderColor: "#f44336",
    color: "white",
    transform: "",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#F53737",
    },
    "&.Mui-disabled": {
      backgroundColor: "#F53737",
      color: "white",
    },
  },
}));

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "In Progress";
  } else {
    // Render a countdown
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

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

const Crash = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState(1);
  const [gameId, setGameId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betting, setBetting] = useState(false);
  const [plannedBet, setPlannedBet] = useState(false);
  const [ownBet, setOwnBet] = useState(null);
  const [autoCashoutEnabled] = useState(false);
  const [autoBetEnabled] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [payout, setPayout] = useState(1);
  const [betAmount, setBetAmount] = useState("0");
  const [target] = useState("2");
  const [privateHash, setPrivateHash] = useState(null);
  const [publicSeed, setPublicSeed] = useState(null);
  const [maxProfit, setMaxProfit] = useState(0);

  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const clickBet = () => {
    if (parseFloat(betAmount) <= 0) return;

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      // Emit new bet event
      crashSocket.emit(
        "join-game",
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount)
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const clickCashout = () => {
    // Emit bet cashout
    crashSocket.emit("bet-cashout");
  };

  // TextField onChange event handler
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };

  /*const onTargetChange = e => {
    setTarget(e.target.value);
  };*/

  /*const handleAutoCashoutChange = e => {
    if (!betting || cashedOut) setAutoCashoutEnabled(e.target.checked);
  };*/

  /*const handleAutoBetChange = e => {
    setAutoBetEnabled(e.target.checked);
    setPlannedBet(false);
  };*/

  // Add game to history
  const addGameToHistory = game => {
    setHistory(state =>
      state.length >= 50
        ? [...state.slice(1, state.length), game]
        : [...state, game]
    );
  };

  // componentDidMount
  useEffect(() => {
    // Error event handler
    const joinError = msg => {
      setJoining(false);
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const joinSuccess = bet => {
      setJoining(false);
      setOwnBet(bet);
      setBetting(true);
      addToast("Successfully joined the game!", { appearance: "success" });
    };

    // Error event handler
    const cashoutError = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const cashoutSuccess = () => {
      addToast("Successfully cashed out!", { appearance: "success" });

      // Reset betting state
      setTimeout(() => {
        setBetting(false);
      }, 1500);
    };

    // New round is starting handler
    const gameStarting = data => {
      // Update state
      setGameId(data._id);
      setStartTime(new Date(Date.now() + data.timeUntilStart));
      setGameState(GAME_STATES.Starting);
      setPrivateHash(data.privateHash);
      setPublicSeed(null);

      setPayout(1);
      setPlayers([]);
      setOwnBet(null);

      if (autoBetEnabled) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );
      } else if (plannedBet) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );

        // Reset planned bet
        setPlannedBet(false);
      }
    };

    // New round started handler
    const gameStart = data => {
      // Update state
      setStartTime(Date.now());
      setGameState(GAME_STATES.InProgress);
      setPublicSeed(data.publicSeed);
    };

    // Current round ended handler
    const gameEnd = data => {
      // Update state
      setGameState(GAME_STATES.Over);
      setPayout(data.game.crashPoint);
      addGameToHistory(data.game);
      setBetting(false);
      setCashedOut(false);
    };

    // New game bets handler
    const gameBets = bets => {
      _.forEach(bets, bet => addNewPlayer(bet));
    };

    // New cashout handler
    const betCashout = bet => {
      // Check if local user cashed out
      if (bet.playerID === user._id) {
        setCashedOut(true);
        setOwnBet(Object.assign(ownBet, bet));

        // Reset betting state
        setTimeout(() => {
          setBetting(false);
        }, 1500);
      }

      // Update state
      setPlayers(state =>
        state.map(player =>
          player.playerID === bet.playerID ? Object.assign(player, bet) : player
        )
      );
    };

    // Current round tick handler
    const gameTick = payout => {
      if (gameState !== GAME_STATES.InProgress) return;

      setPayout(payout);
    };

    // Listeners
    crashSocket.on("game-starting", gameStarting);
    crashSocket.on("game-start", gameStart);
    crashSocket.on("game-end", gameEnd);
    crashSocket.on("game-tick", gameTick);
    crashSocket.on("game-bets", gameBets);
    crashSocket.on("bet-cashout", betCashout);
    crashSocket.on("game-join-error", joinError);
    crashSocket.on("game-join-success", joinSuccess);
    crashSocket.on("bet-cashout-error", cashoutError);
    crashSocket.on("bet-cashout-success", cashoutSuccess);

    return () => {
      // Remove Listeners
      crashSocket.off("game-starting", gameStarting);
      crashSocket.off("game-start", gameStart);
      crashSocket.off("game-end", gameEnd);
      crashSocket.off("game-tick", gameTick);
      crashSocket.off("game-bets", gameBets);
      crashSocket.off("bet-cashout", betCashout);
      crashSocket.off("game-join-error", joinError);
      crashSocket.off("game-join-success", joinSuccess);
      crashSocket.off("bet-cashout-error", cashoutError);
      crashSocket.off("bet-cashout-success", cashoutSuccess);
    };
  }, [
    addToast,
    gameState,
    startTime,
    plannedBet,
    autoBetEnabled,
    autoCashoutEnabled,
    betAmount,
    target,
    ownBet,
    user,
  ]);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const schema = await getCrashSchema();

        console.log(schema);

        // Update state
        setGameId(schema.current._id);
        setPrivateHash(schema.current.privateHash);
        setPublicSeed(schema.current.publicSeed);
        setPlayers(schema.current.players);
        setStartTime(new Date(Date.now() - schema.current.elapsed));
        setHistory(schema.history.reverse());
        setLoading(false);
        setGameState(schema.current.status);
        setMaxProfit(schema.options.maxProfit);
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // Initially, fetch data
    fetchData();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCrashData();

        // Update state
        if (data.bet && data.bet.status === BET_STATES.Playing) {
          setBetting(true);
          setOwnBet(data.bet);
        }
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // If user is signed in, check user data
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          CRASH
          <br />
          <Box className={classes.countdown} alignItems="center" display="flex">
            <img
              style={{ display: "flex", marginRight: 5 }}
              src={timer}
              alt="timer"
            />
            {loading ? (
              <Fragment>Loading</Fragment>
            ) : gameState === GAME_STATES.Over ? (
              <Fragment>Crashed</Fragment>
            ) : (
              <Fragment>
                <Countdown
                  key={startTime}
                  date={startTime}
                  renderer={renderer}
                />
              </Fragment>
            )}
          </Box>
        </Box>
        <Box className={classes.right}>
          {history.map(game => (
            <HistoryEntry key={game._id} game={game} />
          ))}
        </Box>
      </Toolbar>
      <Box className={classes.root}>
        <Container className={classes.container}>
          <Grid container className={classes.contain}>
            <Box className={classes.game} flexDirection="column">
              <Box className={classes.cup}>
                <Box className={classes.gameInfo}>
                  <Tooltip
                    interactive
                    title={
                      <span>
                        Round ID: {gameId}
                        <br />
                        Private Hash: {privateHash}
                        <br />
                        Public Seed:{" "}
                        {publicSeed ? publicSeed : "Not created yet"}
                      </span>
                    }
                    placement="bottom"
                  >
                    <span>
                      <CasinoIcon fontSize="inherit" /> Provably Fair
                    </span>
                  </Tooltip>
                </Box>
                <Box className={classes.maxProfit}>
                  <Tooltip
                    interactive
                    title={`💵 ${parseCommasToThousands(
                      cutDecimalPoints(maxProfit.toFixed(7))
                    )} Max Profit`}
                    placement="bottom"
                  >
                    <span>
                      <InfoIcon fontSize="inherit" /> Max Profit
                    </span>
                  </Tooltip>
                </Box>
                <Cup
                  loading={loading}
                  payout={payout}
                  ownBet={ownBet}
                  gameState={gameState}
                />
              </Box>
              <Box className={classes.placeBet}>
                <div className={classes.title}>Bet Amount</div>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    backgroundColor="#2C3034"
                    value={betAmount}
                    onChange={onBetChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          position="start"
                        >
                          <span role="img" aria-label="cash">💵</span>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className={classes.multiplier}
                    size="medium"
                    color="#2C3034"
                    variant="contained"
                    onClick={() =>
                      setBetAmount(
                        state => (parseFloat(state) / 2).toFixed(2) || 0
                      )
                    }
                  >
                    <span >1/2</span>
                  </Button>
                  <Button
                    className={classes.multiplier}
                    size="medium"
                    color="#2C3034"
                    variant="contained"
                    onClick={() =>
                      setBetAmount(
                        state => (parseFloat(state) * 2).toFixed(2) || 0
                      )
                    }
                  >
                    <span >2x</span>
                  </Button>
                  <Button
                    className={classes.multiplier}
                    size="medium"
                    color="#2C3034"
                    variant="contained"
                    onClick={() =>
                      setBetAmount(
                        user ? parseFloat(user.wallet).toFixed(2) : 0
                      )
                    }
                  >
                    <span >Max</span>
                  </Button>
                  {!betting ? (
                    <Button
                      className={classes.bet}
                      size="medium"
                      color="#F53737"
                      variant="contained"
                      disabled={joining || autoBetEnabled}
                      onClick={clickBet}
                    >
                      <span >
                        {joining
                          ? "Betting..."
                          : plannedBet
                          ? "Cancel bet"
                          : "Place Bet"}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className={classes.cashout}
                      size="medium"
                      color="secondary"
                      variant="contained"
                      disabled={
                        gameState !== GAME_STATES.InProgress || cashedOut
                      }
                      onClick={clickCashout}
                    >
                      <span >
                        {cashedOut ? "Cashed out" : "Cashout"}
                      </span>
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
            <Bets players={players} loading={loading} />
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Crash.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Crash);
