// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());

const {
  createDepositAddress,
  createWithdrawTransaction,
} = require("../controllers/apirone");
const QRCode = require("qrcode");
const colors = require("colors");
const config = require("../config");
const { validateJWT } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const {
  getDepositState,
  getWithdrawState,
} = require("../controllers/site-settings");
const addressValidator = require("wallet-address-validator");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");
const axios = require("axios");

/**
 * @route   POST /deposit
 * @desc    Handles deposit callbacks
 * @access  Public
 */
router.post("/", async (req, res, next) => {
  try {
    if(req?.body?.data?.id != config.authentication.apirone.callback_sercret) return res.status(200).json({ authError: "No valid authorization to make this call." });
    if(req.body.confirmations == 0) {
      console.log(
        colors.blue("Apirone >> PENDING DEPOSIT DECTECTED"),
      );

      let currency = req.body.currency;

      let fiatPrice = 0;
      await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=USD`)
        .then(res => {
          fiatPrice = res.data.USD;
        });
      const amount = (((req.body.value / 100000000) * fiatPrice) * 1.4).toFixed(2);

      // Get user who made this deposit
      const user = await User.findOne({
        [`crypto.${currency.toLowerCase()}.address`]: req.body.input_address,
      });

      currency = currency.toUpperCase()

      // Create a new document
      const newTransaction = new CryptoTransaction({
        type: "deposit", // Transaction type

        currency, // Crypto currency name
        siteValue: amount, // Value in site balance (USD)
        cryptoValue: (amount/1.4), // Value in crypto currency
        address: req.body.input_address, // Crypto address

        txid: req.body.input_transaction_hash, // Blockchain transaction id
        state: 1, // 1 = pending, 2 = declined, 3 = completed

        _user: user.id, // User who made this transaction
      });

      // Save the document
      await newTransaction.save();

      try {
        const { io } = require('../index.js');
        const message = `Your deposit of 💵 ${amount} ($${(amount/1.4).toFixed(2)}) has been seen on the blockchain!`
        io.of('/chat').to(user._id).emit("notify-info", message);
      } catch (error) {
        console.log(error);
      }

      return res.status(200);
    }

    console.log(
      colors.blue("Apirone >> CONFIRMED DEPOSIT DECTECTED"),
    );

    const currency = req.body.currency;
    let fiatPrice = 0;
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=USD`)
      .then(res => {
        fiatPrice = res.data.USD;
      });
    const amount = (((req.body.value / 100000000) * fiatPrice) * 1.4).toFixed(2);

    // Get user who made this deposit
    const user = await User.findOne({
      [`crypto.${currency.toLowerCase()}.address`]: req.body.input_address,
    });

    await CryptoTransaction.findOneAndUpdate({ txid: req.body.input_transaction_hash }, { $set: { state: 3 } });

    // Update user document
    await User.updateOne(
      { _id: user.id },
      {
        $inc: {
          wallet: amount,
          totalDeposited: amount,
          wagerNeededForWithdraw: user.wagerNeededForWithdraw < 0 ? Math.abs(user.wagerNeededForWithdraw) + (amount * 1) : (amount * 1),
        },
      }
    );

    try {
      const { io } = require('../index.js');
      const message = `Your deposit of 💵 ${amount} ($${(amount/1.4).toFixed(2)}) has been credited!`
      io.of('/chat').to(user._id).emit("notify-success", message);
      io.of('/chat').to(user._id).emit("update-wallet", +amount);
    } catch (error) {
      console.log(error);
    }

    // Log debug info
    console.log(
      colors.blue("Apirone >> Deposit verified! Gave"),
      colors.cyan(`💵 ${amount}`),
      colors.blue("credits to"),
      colors.cyan(user.username)
    );

    // Return 200, so the notification doesn't get put on retry list
    res.set('Content-Type', 'text/plain');
    return res.status(200).send('*ok*');
  } catch (error) {
    next(error);
  }
});
