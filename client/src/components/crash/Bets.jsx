import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    background: "#1F2225",
    width: "43%",
    height: "75vh",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
    },
  },
  betAmount: {
    width: "100%",
    height: "3rem",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
    "& span": {
      display: "flex",
      marginLeft: "auto",
      color: "white",
    },
  },
  bets: {
    display: "flex",
    color: "white",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
  },
  bet: {
    display: "flex",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 5,
    width: "100%",
    padding: 10,
    fontSize: 12,
    background: "",
    position: "relative",
  },
  winningAmount: {
    color: "#6afe43",
  },
  avatar: {
    height: 25,
    width: 25,
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.betAmount}>
        ALL BETS
        <span>
          {loading
            ? "Loading..."
            : "💵 " +
              players
                .map(player => parseFloat(player.betAmount))
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
        </span>
      </Box>

      <Box className={classes.bets}>
        {players
          .sort((a, b) => b.betAmount - a.betAmount)
          .map(player => (
            <Box key={player.betId} padding="0 1rem">
              <Box className={classes.bet}>
                <Box
                  style={{
                    width: "40%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    src={player.avatar}
                    variant="rounded"
                  />
                  <Box ml={2}>{player.username}</Box>
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  {player.stoppedAt &&
                    `${(player.stoppedAt / 100).toFixed(2)}x`}
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  <span role="img" aria-label="cash">💵</span> {player.betAmount.toFixed(2)}
                </Box>
                <Box
                  ml="auto"
                  style={{ width: "20%" }}
                  className={classes.winningAmount}
                >
                  {player.winningAmount &&
                    `+💵 ${player.winningAmount.toFixed(2)}`}
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
