// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { createWithdrawTransaction } = require("../../../controllers/apirone");
const axios = require("axios");
const config = require("../../../config/index")

const CryptoTransaction = require("../../../models/CryptoTransaction");
const User = require("../../../models/User");

/**
 * @route   GET /api/external/v1/transactions/list
 * @desc    List all transactions at that time
 * @access  Private
 */
router.get("/list", async (req, res, next) => {
  try {
    const transactions = await CryptoTransaction.find()
      .sort({ created: -1 })
      .populate("_user", ["avatar", "username"]);

    return res.json(transactions);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/external/v1/transactions/lookup/:transactionId
 * @desc    Lookup a single transaction
 * @access  Private
 */
router.get("/lookup/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      _id: req.params.transactionId,
    }).populate("_user", ["username", "avatar"]);

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    return res.json(transaction);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/external/v1/transactions/confirm/:transactionId
 * @desc    Confirm a manual transaction
 * @access  Private
 */
router.post("/confirm/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      type: "withdraw",
      _id: req.params.transactionId,
      state: 4,
    });

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    let ltcPrice, withdrawAmtSat;
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${transaction.currency.toUpperCase()}&tsyms=USD`)
        .then((res) => {
            ltcPrice = res.data.USD;
        }).catch((err) => {
            console.error(err);
        });
    withdrawAmtSat = Number(transaction.siteValue/1.4) / ltcPrice;
    withdrawAmtSat = Number((withdrawAmtSat * 100000000).toFixed(0));

    // Sends the withdraw on the api client
    const withdrawData = {
      "currency": `${transaction.currency.toLowerCase()}`,
      "transfer-key": `${config.authentication.apirone.transfer_key}`,
      "destinations": [
        {
          "address": transaction.address,
          "amount": withdrawAmtSat
        },
      ],
      "fee": "normal",
      "subtract-fee-from-amount": true
    }

    let withdrawRes;
    await axios.post(`${config.authentication.apirone.base_url}/v2/accounts/${config.authentication.apirone.account_id}/transfer`, withdrawData)
      .then(res => {
          withdrawRes = res.data;
      });

    // Update document
    await CryptoTransaction.updateOne(
      { _id: transaction.id },
      {
        $set: {
          state: 3,
          txid: withdrawRes.txs[0],
          cryptoValue: Math.abs(
            parseFloat(transaction.siteValue/1.4)
          ),
        },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/external/v1/transactions/cancel/:transactionId
 * @desc    Cancel a manual transaction
 * @access  Private
 */
router.post("/cancel/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      type: "withdraw",
      _id: req.params.transactionId,
      state: 4,
    });

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    // Update document
    const tx = await CryptoTransaction.findOneAndUpdate(
      { _id: transaction.id },
      {
        $set: {
          state: 2,
        },
      }
    );

    // give user back balance 
    await User.updateOne(
      {
        _id: tx._user
      },
      {
        $inc: {
          wallet: +tx.siteValue,
          totalWithdrawn: -Math.abs(tx.siteValue),
        }
      }
    )

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});
