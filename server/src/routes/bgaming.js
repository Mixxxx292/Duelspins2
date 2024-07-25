// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");
const axios = require("axios"); 
const colors = require("colors");

const { readFileSync } = require("node:fs");
const { createSign, createVerify } = require("node:crypto");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");

const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../controllers/race");
const { checkAndApplyRakeback } = require("../controllers/vip");
const { checkAndApplyAffiliatorCut } = require("../controllers/affiliates");

const User = require("../models/User");
const SlotGame = require("../models/SlotsGame");
const SlotWin = require("../models/SlotsWin");
const path = require('path');
const { Stream } = require("node:stream");
const crypto = require('crypto');

function generateRequestSignature(body, authToken) {
  const hmac = crypto.createHmac('sha256', authToken);
  return hmac.update(body).digest('hex');
}

function validateRequestSignature(body, authToken, receivedSignature) {
  const expectedSignature = generateRequestSignature(body, authToken);
  return expectedSignature === receivedSignature;
}

/**
 * @route   GET /api/bgaming
 * @desc    
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    return res.json({
      response: "Moonbet BGAMING WALLET API v.1.0.0",
      uptimeMinutes: Math.floor(process.uptime() / 60),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/bgaming/play
 * @desc    
 * @access  Private
 */
router.post("/play", async (req, res, next) => {
  try {    
    // Verifiy payload and signature using public key.
    if (!validateRequestSignature(JSON.stringify(req.body), config.authentication.bgaming.AUTH_TOKEN, req.headers['x-request-sign'])) {
      return res.status(403).json({"code":403,"message":"Request sign doesn't match"});
    }

    let user = await User.findOne({ _id: req.body.user_id });
    const actions = req.body.actions;
    let transactions = [];
    if(!actions) {
      const body = {
        "balance": Number(((user.wallet/1.4)*100).toFixed(0))
      }
  
      const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);
  
      const headers = {
        "x-request-sign": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      }
  
      return res.status(200)
        .set("x-request-sign", headers["x-request-sign"])
        .set("accept", headers.accept)
        .set("Content-Type", headers["Content-Type"])
        .json(body);
    }
    for(let i = 0; i < actions.length; i++) {
      const c = actions[i];
      const x = await SlotGame.findOne({ transaction_uuid: c.action_id }) || await SlotWin.findOne({ transaction_uuid: c.action_id })
      if(x) {
        const now = new Date();
        const dateString = now.toISOString();
        
        transactions.push({
          "action_id": c.action_id,
          "tx_id": x._id,
          "processed_at": dateString
        });

        const body = {
          "balance": Number(((user.wallet/1.4)*100).toFixed(0)),
          "game_id": req.body.game_id,
          "transactions": transactions
        }
    
        const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);
    
        const headers = {
          "x-request-sign": signature,
          "accept": "application/json",
          "Content-Type": "application/json"
        }
    
        return res.status(200)
          .set("x-request-sign", headers["x-request-sign"])
          .set("accept", headers.accept)
          .set("Content-Type", headers["Content-Type"])
          .json(body);
      }

      if(c.action == "bet") {
        const now = new Date();
        const dateString = now.toISOString();
        if(user.wallet/1.4*100 < c.amount) {
          const body = {
            "code": 100,
            "message": "Not enough funds.",
            "balance": Number(((user.wallet/1.4)*100).toFixed(0))
          }
      
          const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);
      
          const headers = {
            "x-request-sign": signature,
            "accept": "application/json",
            "Content-Type": "application/json"
          }
      
          return res.status(412)
            .set("x-request-sign", headers["x-request-sign"])
            .set("accept", headers.accept)
            .set("Content-Type", headers["Content-Type"])
            .json(body);
        }

        console.log(c.amount/100)
        // Push game to db
        const newGame = SlotGame({
          token: null,
          transaction_uuid: c.action_id,
          user: req.body.user_id,
          round: null,
          request_uuid: null,
          game_id: null, // req.body.game_id,
          game_code: req.body.game,
          currency: req.body.currency,
          bet: null,
          betAmount: c.amount/100,
          rolled_back: false,
        });

        // Save the new document
        await newGame.save();

        await User.findOneAndUpdate({ _id: req.body.user_id }, { $inc: { wallet: -(c.amount/100*1.4), wager: +(c.amount/100*1.4), wagerNeededForWithdraw: -(c.amount/100*1.4), bets_placed: +1 }, });
        user = await User.findOne({ _id: req.body.user_id });

        await insertNewWalletTransaction(req.body.user_id, -(c.amount/100*1.4), "Slots bet", {
          transactionId: newGame._id,
        });

        // Calculate house edge
        const houseEdge = (c.amount/100*1.4).toFixed(2) * config.games.slots.houseEdge;

        // Apply user's rakeback if eligible
        await checkAndApplyRakeback(user._id, houseEdge);


        // Apply cut of house edge to user's affiliator
        await checkAndApplyAffiliatorCut(user._id, houseEdge);

        // Update user's race progress if there is an active race
        await checkAndEnterRace(user._id, Math.abs((c.amount/100*1.4)));

        transactions.push({
          "action_id": c.action_id,
          "tx_id": newGame._id,
          "processed_at": dateString
        });

        try {
          const { io } = require('../index.js');
          const emitAmount = (c.amount/100*1.4).toFixed(2);
          io.of('/slots').to(req.body.user_id).emit("update-wallet", -emitAmount);
        } catch (error) {
          console.log(error);
        }

        console.log(
          colors.grey(`Slots >> BET >> Amount`),
          "$" + c.amount/100,
          colors.grey("from"),
          user.username,
          colors.grey("(tx_uuid:"),
          c.action_id,
          colors.grey(")")
        );
      } else if(c.action == "win") {
        const now = new Date();
        const dateString = now.toISOString();

        // Push game to db
        const newGame = SlotWin({
          token: null,
          transaction_uuid: c.action_id,
          reference_transaction_uuid: "value",
          user: req.body.user_id,
          round: null,
          request_uuid: null,
          original_action_id: null,
          game_id: null, // req.body.game_id,
          game_code: req.body.game,
          currency: req.body.currency,
          bet: null,
          betAmount: c.amount/100,
          rolled_back: false,
        });

        // Save the new document
        await newGame.save();

        await User.findOneAndUpdate({ _id: req.body.user_id }, { $inc: { wallet: +(c.amount/100*1.4), bets_won: +1 }, });
        user = await User.findOne({ _id: req.body.user_id });

        await insertNewWalletTransaction(req.body.user_id, (c.amount/100*1.4), "Slots win", {
          transactionId: newGame._id,
        });

        transactions.push({
          "action_id": c.action_id,
          "tx_id": newGame._id,
          "processed_at": dateString
        });

        try {
          const { io } = require('../index.js');
          const emitAmount = (c.amount/100*1.4).toFixed(2);
          io.of('/slots').to(req.body.user_id).emit("update-wallet", +emitAmount);
        } catch (error) {
          console.log(error);
        }

        console.log(
          colors.green(`Slots >> WIN >> Paid`),
          "$" + c.amount/100,
          colors.green("to"),
          user.username,
          colors.green("(tx_uuid:"),
          c.action_id,
          colors.green(")")
        );
      }
    }

    const body = {
      "balance": Number(((user.wallet/1.4)*100).toFixed(0)),
      "game_id": req.body.game_id,
      "transactions": transactions
    }

    const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);

    const headers = {
      "x-request-sign": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    }

    return res.status(200)
      .set("x-request-sign", headers["x-request-sign"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json(body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/bgaming/rollback
 * @desc    
 * @access  Private
 */
router.post("/rollback", async (req, res, next) => {
  try {    
    // Verifiy payload and signature using public key.
    if (!validateRequestSignature(JSON.stringify(req.body), config.authentication.bgaming.AUTH_TOKEN, req.headers['x-request-sign'])) {
      return res.status(403).json({"code":403,"message":"Request sign doesn't match"});
    }
    
    let user = await User.findOne({ _id: req.body.user_id });
    const actions = req.body.actions;
    const transactions = [];
    for(let i = 0; i < actions.length; i++) {
      const c = actions[i];
      const now = new Date();
      const dateString = now.toISOString();
      if(c.action == "rollback") {
        if(c.original_action_id) {
          user = await User.findOne({ _id: req.body.user_id });
          const schema = await SlotGame.findOne({ transaction_uuid: c.original_action_id, rolled_back: false }) || await SlotWin.findOne({ transaction_uuid: c.original_action_id, rolled_back: false });
          const amount = schema.betAmount;

          console.log(schema?.reference_transaction_uuid)
          console.log(user.wallet)
          console.log(amount)
          if(schema?.reference_transaction_uuid) {
            await User.findOneAndUpdate({ _id: req.body.user_id }, { $inc: { wallet: -(amount*1.4), bets_placed: -1 }, });
            user = await User.findOne({ _id: req.body.user_id });
            console.log(user.wallet)
          } else {
            await User.findOneAndUpdate({ _id: req.body.user_id }, { $inc: { wallet: +(amount*1.4), wager: -(amount*1.4), bets_placed: -1 }, });
            user = await User.findOne({ _id: req.body.user_id });
            console.log(user.wallet)
          }


          // Sets the game/win name rolled_back to true
          await SlotGame.findOneAndUpdate({ transaction_uuid: c.original_action_id }, { $set: { rolled_back: true, } });
          await SlotWin.findOneAndUpdate({ transaction_uuid: c.original_action_id }, { $set: { rolled_back: true, } });

          await insertNewWalletTransaction(req.body.user_id, +(amount*1.4), "Slots rollback", {
            transactionId: schema._id
          });

          transactions.push({
            "action_id": c.action_id,
            "tx_id": schema._id,
            "processed_at": dateString
          });

          try {
            const { io } = require('../index.js');
            const emitAmount = (amount*1.4).toFixed(2);
            io.of('/slots').to(req.body.user_id).emit("update-wallet", +emitAmount);
          } catch (error) {
            console.log(error);
          }

          console.log(
            colors.magenta(`Slots >> ROLLBACK >> Amount`),
            "$" + amount,
            colors.magenta("from"),
            user.username,
            colors.magenta("(tx_uuid:"),
            c.action_id,
            colors.magenta(")")
          );
        } else {

          user = await User.findOneAndUpdate({ _id: req.body.user_id }, { $inc: { wallet: +(c.amount*1.4), wager: -(c.amount*1.4), bets_placed: -1 }, });

          // Sets the game/win name rolled_back to true
          await SlotGame.findOneAndUpdate({ transaction_uuid: c.original_action_id }, { $set: { rolled_back: true, } });
          await SlotWin.findOneAndUpdate({ transaction_uuid: c.original_action_id }, { $set: { rolled_back: true, } });

          await insertNewWalletTransaction(req.body.user_id, +(c.amount/100*1.4), "Slots rollback", {
            transactionId: await SlotWin.findOne({ transaction_uuid: c.original_action_id })._id ? await SlotGame.findOne({ transaction_uuid: c.original_action_id })._id : null,
          });

          transactions.push({
            "action_id": c.action_id,
            "tx_id": newGame._id,
            "processed_at": dateString
          });

          try {
            const { io } = require('../index.js');
            const emitAmount = (c.amount/100*1.4).toFixed(2);
            io.of('/slots').to(req.body.user_id).emit("update-wallet", +emitAmount);
          } catch (error) {
            console.log(error);
          }

          console.log(
            colors.magenta(`Slots >> ROLLBACK >> Amount`),
            "$" + c.amount/100,
            colors.magenta("from"),
            user.username,
            colors.magenta("(tx_uuid:"),
            c.action_id,
            colors.magenta(")")
          );
        }
      }
    }

    const body = {
      "balance": Number(((user.wallet/1.4)*100).toFixed(0)),
      "game_id": req.body.game_id,
      "transactions": transactions
    }

    const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);

    const headers = {
      "x-request-sign": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    }

    return res.status(200)
      .set("x-request-sign", headers["x-request-sign"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json(body);
  } catch (error) {
    return next(error);
  }
});