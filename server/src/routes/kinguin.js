// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const fs = require('fs');

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");


/**
 * @route   POST /api/kinguin/redeem
 * @desc    Redeem a giftcard code
 * @access  Private
 */
router.post(
  "/redeem",
  [
    validateJWT,
    check("code", "Giftcard code is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid giftcard code type"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    try {
      // Get user
      const user = await User.findOne({ _id: req.user.id });

      // If user is not found
      if (!user) {
        return next(
          new Error("Couldn't find user! Maybe database did an error?")
        );
      }

      // If user has restricted transactions
      if (user.transactionsLocked) {
        res.status(403);
        return next(
          new Error(
            "Your account has a transaction restriction. Please contact support for more information."
          )
        );
      }

      let value;

      // Check each file for the gift card code
      const values = [5, 10, 20, 50, 100];
      for (const val of values) {
        const filePath = `${__dirname}/codes/${val}.txt`;
        const codes = fs.readFileSync(filePath, 'utf8').split('\n');
        const index = codes.indexOf(code);
        if (index !== -1) {
          value = val;
          codes.splice(index, 1); // Remove the code from the array
          const updatedCodes = codes.join('\n');
          fs.writeFileSync(filePath, updatedCodes, 'utf8'); // Update the file without the redeemed code
          break;
        }
      }

      // If no code was found in any file, return an error
      if (!value) {
        res.status(400);
        return next(new Error("This giftcard code doesn't exist or has been used!"));
      }

      await User.updateOne(
        { _id: user.id },
        {
          $inc: {
            wallet: value,
            wagerNeededForWithdraw: user.wagerNeededForWithdraw < 0 ? Math.abs(value) + (value * 1) : (value * 1),
            totalDeposited: value
          }
        }
      );

      const currency = "Giftcard";
      // Create a new document
      const newTransaction = new CryptoTransaction({
        type: "deposit", // Transaction type

        currency, // Crypto currency name
        siteValue: (value*1.4), // Value in site balance (USD)
        cryptoValue: value, // Value in crypto currency
        address: null, // Crypto address

        txid: code, // Blockchain transaction id
        state: 3, // 1 = pending, 2 = declined, 3 = completed

        _user: user.id, // User who made this transaction
      });

      // Save the document
      await newTransaction.save();

      insertNewWalletTransaction(user.id, value, "Kinguin GC redeemed", {
        giftcardId: code,
      });

      return res.json({ message: `Your 💵 ${(value*1.4).toFixed(2)} ($${value}) kinguin giftcard code has been redeemed!`, payout: value });
    } catch (error) {
      return next(error);
    }
  }
);
