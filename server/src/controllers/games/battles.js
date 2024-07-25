// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const { getBattlesState } = require("../site-settings");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");

const User = require("../../models/User");
const BattlesGame = require("../../models/BattlesGame");

// Declare game states
const GAME_STATES = {
  waiting: 1,
  spinning: 2,
  completed: 3,
};

// Get socket.io instance
const listen = io => {
  // Listen for new websocket connections
  io.of("/battles").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connnections
    socket.use(throttlerController(socket));

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify-success", "Successfully authenticated!");
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify-error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });

    socket.on("create-game", async (gameData, betAmount) => {
      // Validate user input
      if (typeof betAmount !== "number" || isNaN(betAmount))
        return socket.emit("game-creation-error", "Invalid betAmount type!");
      if (!loggedIn)
        return socket.emit("game-creation-error", "You are not logged in!");
  
      // Get battles enabled status
      const isEnabled = getBattlesState();
  
      // If battles is disabled
      if (!isEnabled) {
        return socket.emit(
          "game-creation-error",
          "Battles is currently disabled! Contact admins for more information."
        );
      }   

      try {
        // Get user from database
        const dbUser = await User.findOne({ _id: user.id });

        // If user has restricted bets
        if (dbUser.betsLocked) {
          return socket.emit(
            "game-creation-error",
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // If user can afford this bet
        if (dbUser.wallet < parseFloat(betAmount.toFixed(2))) {
          return socket.emit("game-creation-error", "You can't afford to create this battle!");
        }

        // Remove bet amount from user's balance
        await User.updateOne(
          { _id: user.id },
          {
            $inc: {
              wallet: -Math.abs(parseFloat(betAmount.toFixed(2))),
              wager: Math.abs(parseFloat(betAmount.toFixed(2))),
              wagerNeededForWithdraw: -Math.abs(
                parseFloat(betAmount.toFixed(2))
              ),
              bets_placed: +1
            },
          }
        );
        insertNewWalletTransaction(
          user.id,
          -Math.abs(parseFloat(betAmount.toFixed(2))),
          "Battles creation",
          { battlesGameId: newGame._id }
        );

        // Update local wallet
        socket.emit(
          "update-wallet",
          -Math.abs(parseFloat(betAmount.toFixed(2)))
        );

        // Update user's race progress if there is an active race
        await checkAndEnterRace(
          user.id,
          Math.abs(parseFloat(betAmount.toFixed(2)))
        );

        // Calculate house edge
        const houseRake = parseFloat(betAmount.toFixed(2)) * config.games.battles.houseEdge;

        // Apply 5% rake to current race prize pool
        await checkAndApplyRakeToRace(houseRake * 0.05);

        // Apply user's rakeback if eligible
        await checkAndApplyRakeback(user.id, houseRake);

        // Apply cut of house edge to user's affiliator
        await checkAndApplyAffiliatorCut(user.id, houseRake);

        // Creating new battles object
        const newGame = {
          autoCashOut,
          betAmount,
          createdAt: new Date(),
          playerID: user.id,
          username: user.username,
          avatar: user.avatar,
          status: BET_STATES.Playing,
          forcedCashout: false,
        };

        return socket.emit("game-creation-success", formattedBet);
      } catch (error) {
        console.error(error);

        return socket.emit(
          "game-creation-error",
          "There was an error while proccessing your bet"
        );
      }
    });
  });

};

// Export functions
module.exports = {
  listen,
};
