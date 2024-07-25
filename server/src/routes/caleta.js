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

/* Declareing functions to verify signatures
function verify(msg, key, signature) {
  const verify = createVerify("SHA256");
  verify.write(msg);
  verify.end();
  return verify.verify(key, signature, "base64");
}*/

function verifySignature(body, publicKey, signature) {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(body, 'utf8');
  
  const isSignatureValid = verifier.verify(publicKey, signature, 'base64');
  return isSignatureValid;
}

function encrypt(msg, key) {
  const sign = createSign("SHA256");
  sign.write(msg);
  sign.end();
  return sign.sign(key, "base64");
}

const public = readFileSync(path.resolve("keys/public.pem"), "utf-8");
const private = readFileSync(path.resolve("keys/key.pem"), "utf-8");
const caleta_pub = readFileSync(path.resolve("keys/caleta.pem"), "utf-8");

/**
 * @route   POST /api/wallet/check
 * @desc    
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    return res.json({
      response: "Moonbet CALETA WALLET API v.1.0.0",
      uptimeMinutes: Math.floor(process.uptime() / 60),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/wallet/check
 * @desc    
 * @access  Public
 */
router.post("/check", async (req, res, next) => {
  try {
    console.log(req.body)

  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/wallet/balance/
 * @desc    Get's users wallet balance
 * @access  Private
 */
router.post("/balance", async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.supplier_user });

    if(user.session != req.body.token) throw "Not a vaild session";

    const msg = `{"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":${parseFloat(user.wallet.toFixed(2)*100000)}}`;

    // Generates Signature using private key.
    const signature = encrypt(msg, private);

    const headers = {
      "X-Auth-Signature": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    };

    return res.status(200)
      .set("X-Auth-Signature", headers["X-Auth-Signature"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json({
      "user": `${user._id}`,
      "status": "RS_OK",
      "request_uuid": req.body.request_uuid,
      "currency": "USD",
      "balance": parseFloat(user.wallet.toFixed(2)/1.4*100000)
    });

  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/wallet/bet/
 * @desc    Logs bet into schema and returns updated balance
 * @access  Private
 */
router.post("/bet", async (req, res, next) => {
  try {    
    // Verifiy payload and signature using public key.
    // if (!verifySignature(JSON.stringify(req.body), caleta_pub, req.get('X-Auth-Signature'))) throw "Not a valid signature";

    let user = await User.findOne({ _id: req.body.supplier_user });
    if(user.session != req.body.token) return res.status(200).json({ status: "RS_ERROR_TOKEN_EXPIRED" });
    if(await SlotGame.findOne({ transaction_uuid: req.body.transaction_uuid })) {
      const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

      const signature = encrypt(msg, private);
  
      const headers = {
        "X-Auth-Signature": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      };
  
      return res.status(200)
        .set("X-Auth-Signature", headers["X-Auth-Signature"])
        .set("accept", headers.accept)
        .set("Content-Type", headers["Content-Type"])
        .json({
        "user": `${user._id}`,
        "status": "RS_OK",
        "request_uuid": req.body.request_uuid,
        "currency": "USD",
        "balance": parseFloat(user.wallet.toFixed(2)/1.4*100000)
      });
    }

    // Push game to db
    const newGame = SlotGame({
      token: req.body.token,
      transaction_uuid: req.body.transaction_uuid,
      user: req.body.supplier_user,
      round: req.body.round,
      request_uuid: req.body.request_uuid,
      game_id: req.body.game_id,
      game_code: req.body.game_code,
      currency: req.body.currency,
      bet: req.body.bet,
      betAmount: req.body.amount/100000,
      rolled_back: false,
    });

    // Save the new document
    await newGame.save();

    await User.findOneAndUpdate({ _id: req.body.supplier_user }, { $inc: { wallet: -(req.body.amount/100000*1.4), wager: +(req.body.amount/100000*1.4), wagerNeededForWithdraw: -(req.body.amount/100000*1.4), bets_placed: +1 }, });
    user = await User.findOne({ _id: req.body.supplier_user });

    await insertNewWalletTransaction(req.body.supplier_user, -(req.body.amount/100000*1.4), "Slots bet", {
      transactionId: newGame._id,
    });

    // Calculate house edge
    const houseEdge = parseFloat((req.body.amount/100000*1.4).toFixed(2)) * config.games.slots.houseEdge;

    // Apply user's rakeback if eligible
    await checkAndApplyRakeback(req.body.supplier_user, houseEdge);

    // Apply cut of house edge to user's affiliator
    await checkAndApplyAffiliatorCut(req.body.supplier_user, houseEdge);

    // Update user's race progress if there is an active race
    await checkAndEnterRace(req.body.supplier_user, Math.abs((req.body.amount/100000*1.4)));

    try {
      const { io } = require('../index.js');
      const emitAmount = (req.body.amount/100000*1.4).toFixed(2);
      io.of('/slots').to(req.body.supplier_user).emit("update-wallet", -emitAmount);
    } catch (error) {
      console.log(error);
    }

    console.log(
      colors.grey(`Slots >> BET >> Amount`),
      "$" + req.body.amount/100000,
      colors.grey("from"),
      user.username,
      colors.grey("(tx_uuid:"),
      req.body.transaction_uuid,
      colors.grey(")")
    );

    const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

    const signature = encrypt(msg, private);

    const headers = {
      "X-Auth-Signature": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    };

    return res.status(200)
      .set("X-Auth-Signature", headers["X-Auth-Signature"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json({
      "user": `${user._id}`,
      "status": "RS_OK",
      "request_uuid": req.body.request_uuid,
      "currency": "USD",
      "balance": parseFloat(user.wallet.toFixed(2)/1.4*100000)
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/wallet/win/
 * @desc    Logs win and returns updated balance
 * @access  Private
 */
router.post("/win", async (req, res, next) => {
  try {
   // Verifiy payload and signature using public key.
   //,if (!verifySignature(JSON.stringify(req.body), caleta_pub, req.get('X-Auth-Signature'))) throw "Not a valid signature";

    let user = await User.findOne({ _id: req.body.supplier_user });

    if(await SlotWin.findOne({ transaction_uuid: req.body.transaction_uuid })) {
      const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

      const signature = encrypt(msg, private);
  
      const headers = {
        "X-Auth-Signature": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      };
  
      return res.status(200)
        .set("X-Auth-Signature", headers["X-Auth-Signature"])
        .set("accept", headers.accept)
        .set("Content-Type", headers["Content-Type"])
        .json({
        "user": `${user._id}`,
        "status": "RS_OK",
        "request_uuid": req.body.request_uuid,
        "currency": "USD",
        "balance": parseFloat(user.wallet.toFixed(2)/1.4*100000)
      });    
    }

    if(req.body.amount != 0) {
      // Push game to db
      const newGame = SlotWin({
        token: req.body.token,
        transaction_uuid: req.body.transaction_uuid,
        user: req.body.supplier_user,
        round: req.body.round,
        request_uuid: req.body.request_uuid,
        reference_transaction_uuid: req.body.reference_transaction_uuid,
        game_id: req.body.game_id,
        game_code: req.body.game_code,
        currency: req.body.currency,
        bet: req.body.bet,
        betAmount: req.body.amount/100000,
        rolled_back: false,
      });

      // Save the new document
      await newGame.save();

      await User.findOneAndUpdate({ _id: req.body.supplier_user }, { $inc: { wallet: +(req.body.amount/100000*1.4), wager: +(req.body.amount/100000*1.4), bets_won: +1 }, });
      user = await User.findOne({ _id: req.body.supplier_user });

      await insertNewWalletTransaction(req.body.supplier_user, (req.body.amount/100000*1.4), "Slots win", {
        transactionId: newGame._id,
      });

      try {
        const { io } = require('../index.js');
        const emitAmount = (req.body.amount/100000*1.4).toFixed(2);
        setTimeout(() =>  io.of('/slots').to(req.body.supplier_user).emit("update-wallet", +emitAmount), 3000);
      } catch (error) {
        console.log(error);
      }

      console.log(
        colors.green(`Slots >> WIN >> Paid`),
        "$" + req.body.amount/100000,
        colors.green("to"),
        user.username,
        colors.green("(tx_uuid:"),
        req.body.transaction_uuid,
        colors.green(")")
      );
    }
   
    const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

    const signature = encrypt(msg, private);

    const headers = {
      "X-Auth-Signature": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    };

    return res.status(200)
      .set("X-Auth-Signature", headers["X-Auth-Signature"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json({
      "user": `${user._id}`,
      "status": "RS_OK",
      "request_uuid": req.body.request_uuid,
      "currency": "USD",
      "balance": parseFloat(user.wallet.toFixed(2)/1.4*100000)
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/wallet/rollback/
 * @desc    
 * @access  Private
 */
router.post("/rollback", async (req, res, next) => {
  try {
    // Verifiy payload and signature using public key.
    // if (!verifySignature(JSON.stringify(req.body), caleta_pub, req.get('X-Auth-Signature'))) throw "Not a valid signature";
    
    let user = await User.findOne({ _id: req.body.user });
    if(await SlotGame.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid, rolled_back: true }) || await SlotWin.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid, rolled_back: true})) {
      const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

      const signature = encrypt(msg, private);
  
      const headers = {
        "X-Auth-Signature": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      };
  
      return res.status(200)
        .set("X-Auth-Signature", headers["X-Auth-Signature"])
        .set("accept", headers.accept)
        .set("Content-Type", headers["Content-Type"])
        .json({
        "user": `${user._id}`,
        "status": "RS_OK",
        "request_uuid": req.body.request_uuid,
        "currency": "USD",
        "balance": parseFloat(user.wallet.toFixed(2)*100000)
      });
    }
   
    // Find user from transaction and update balance
    await User.findOneAndUpdate({ _id: req.body.user }, { $inc: { wallet: req.body.amount/100000*1.4,  wager: -(req.body.amount/100000*1.4) } });
    user = await User.findOne({ _id: req.body.user });

    // Sets the game/win name rolled_back to true
    await SlotGame.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid }, { $set: { rolled_back: true, } });
    await SlotWin.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid }, { $set: { rolled_back: true, } });

    await insertNewWalletTransaction(req.body.supplier_user, (req.body.amount/100000), "Slots rollback", {
      transactionId: await SlotWin.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid })._id ? await SlotGame.findOneAndUpdate({ transaction_uuid: req.body.reference_transaction_uuid })._id : null,
    });

    try {
      const { io } = require('../index.js');
      const emitAmount = (req.body.amount/100000*1.4).toFixed(2);
      io.of('/slots').to(req.body.supplier_user).emit("update-wallet", +emitAmount);
    } catch (error) {
      console.log(error);
    }

    console.log(
      colors.magenta(`Slots >> ROLLBACK >> Amount`),
      req.body.amount/100000,
      colors.magenta("to"),
      user.username,
      colors.magenta("(tx_uuid:"),
      req.body.transaction_uuid,
      colors.magenta(")")
    );

    const msg = `"user":"${user._id}","status":"RS_OK","request_uuid":"${req.body.request_uuid}","currency":"USD","balance":"${parseFloat(user.wallet.toFixed(2)*100000)}"`;

    const signature = encrypt(msg, private);

    const headers = {
      "X-Auth-Signature": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    };

    return res.status(200)
      .set("X-Auth-Signature", headers["X-Auth-Signature"])
      .set("accept", headers.accept)
      .set("Content-Type", headers["Content-Type"])
      .json({
      "user": `${user._id}`,
      "status": "RS_OK",
      "request_uuid": req.body.request_uuid,
      "currency": "USD",
      "balance": parseFloat(user.wallet.toFixed(2)*100000)
    });
  } catch (error) {
    console.log(error)
    return next(error);
  }
});