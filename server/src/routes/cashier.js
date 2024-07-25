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

// // FIXME: Only for beta
// router.use((req, res, next) => {
//   res.status(400);
//   return next(new Error("Cashier is disabled during beta testing!"));
// });

// List all the accounts when server is started
try {
  // listAccountInfo();
} catch (error) {
  console.log(
    colors.grey("Apirone >> Couldn't list account info:"),
    colors.red(error.message)
  );
}

// Function to generate QRCode data URL
async function generateCryptoQr(address) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(address, (error, url) => {
      // If there was an error while creating QR
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });
}

// Function to list all the accounts
/*async function listAccountInfo() {
  const wallets = config.authentication.coinbase.wallets;
  const accountIds = Object.keys(wallets).map(key => wallets[key]);
  /* const accounts = await getWalletAccounts();
  const usedAccounts = accounts.filter(account =>
    accountIds.includes(account.id)
  );

  usedAccounts.forEach(account =>
    console.log(
      colors.grey("Apirone >> Loaded account"),
      colors.blue(account.name) + colors.grey(","),
      colors.grey("balance:"),
      colors.blue(`${account.balance.amount} ${account.balance.currency}`)
    )
  );*/
//}

/**
 * @route   GET /api/cashier/crypto/addresses
 * @desc    Get crypto addresses for all currencies
 * @access  Private
 */
router.get("/crypto/addresses", validateJWT, async (req, res, next) => {
  try {
    // Check if deposits are enabled
    const isEnabled = getDepositState();

    // If deposits are not enabled
    if (!isEnabled) {
      res.status(400);
      return next(
        new Error(
          "Deposits are currently disabled! Contact admins for more information"
        )
      );
    }

    const user = await User.findOne({ _id: req.user.id }).lean();

    // If user was not found
    if (!user) {
      return next(new Error("User not found! (database error)"));
    }

    // Check if user has created addresses
    if (user.crypto) {
      return res.json(user.crypto);
    }

    // Generate deposit address for all currencies
    const addrs = await createDepositAddress();

    // Construct channels object
    const addresses = {
      btc: {
        address: addrs.btc,
        dataUrl: await generateCryptoQr(addrs.btc),
      },
      doge: {
        address: addrs.doge,
        dataUrl: await generateCryptoQr(addrs.doge),
      },
      ltc: {
        address: addrs.ltc,
        dataUrl: await generateCryptoQr(addrs.ltc),
      },
    };
    console.log(1)
    // Update user
    await User.updateOne({ _id: req.user.id }, { $set: { crypto: addresses } });
    console.log(2)

    return res.json(addresses);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cashier/crypto/withdraw
 * @desc    Withdraw a currency
 * @access  Private
 */
router.post(
  "/crypto/withdraw",
  [
    validateJWT,
    check("currency", "Withdraw currency is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw currency type")
      .isIn(["BTC", "DOGE", "LTC"])
      .withMessage("Invalid currency!"),
    check("address", "Withdraw address is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw address type"),
    check("amount", "Withdraw amount is required")
      .notEmpty()
      .isFloat()
      .withMessage("Invalid Withdraw amount!")
      .toFloat(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currency, address, amount } = req.body;
    try {
      // Check if deposits are enabled
      const isEnabled = getWithdrawState();

      // If deposits are not enabled
      if (!isEnabled) {
        res.status(400);
        return next(
          new Error(
            "Withdraws are currently disabled! Contact admins for more information"
          )
        );
      }

      // Check that amount exceeds $5.00
      /*if (amount < 10) {
        res.status(400);
        return next(new Error("Minimum withdraw amount must be atleast 💵 10.00"));
      }*/

      // Validate wallet address
      const isValid = addressValidator.validate(address, currency, "prod");

      // If address is not valid
      if (!isValid) {
        res.status(400);
        return next(new Error("Please enter a valid wallet address!"));
      }

      // Get the latest user obj
      const user = await User.findOne({ _id: req.user.id });

      // Check that user is allowed to withdraw
      if (user.transactionsLocked) {
        res.status(403);
        return next(
          new Error(
            "Your account has a transaction restriction. Please contact support for more information."
          )
        );
      }

      // Check that user has enough balance
      if (Math.abs(amount) > user.wallet) {
        res.status(400);
        return next(new Error("You can't afford this withdraw!"));
      }

      // Check that user has wagered atleast 50% of his deposited amount
      if (user.wagerNeededForWithdraw > 0) {
        res.status(400);
        return next(
          new Error(
            `You must wager at least 💵 ${user.wagerNeededForWithdraw.toFixed(
              2
            )} before withdrawing!`
          )
        );
      }

      // If user has deposited less than $5.00 before withdrawing
      if (user.totalDeposited < 5) {
        res.status(400);
        return next(
          new Error("You must have deposited at least 💵 5.00 before withdrawing!")
        );
      }

      // If user has wager limit, check if it's been passed
      if (user.wager < user.customWagerLimit) {
        res.status(400);
        return next(
          new Error(
            `Because your account has wager limit, you must wager still 💵 ${(
              user.customWagerLimit - user.wager
            ).toFixed(2)} before withdrawing!`
          )
        );
      }

      // Create a new document
      const newTransaction = new CryptoTransaction({
        type: "withdraw", // Transaction type

        currency, // Crypto currency name
        siteValue: amount, // Value in site balance (USD)
        cryptoValue: null, // Value in crypto currency
        address, // Crypto address

        txid: null, // Blockchain transaction id
        state: config.site.manualWithdrawsEnabled ? 4 : 1, // 1 = pending, 2 = declined, 3 = completed, 4 = manual hold

        _user: user.id, // User who made this transaction
      });

      // Remove balance from user
      await User.updateOne(
        { _id: user.id },
        {
          $inc: {
            wallet: -Math.abs(amount),
            totalWithdrawn: Math.abs(amount),
          },
        }
      );
      insertNewWalletTransaction(
        user.id,
        -Math.abs(amount),
        "Crypto withdraw",
        { transactionId: newTransaction.id }
      );

      // If manual withdraws are not on
      if (!config.site.manualWithdrawsEnabled) {
        let ltcPrice, withdrawAmtSat;
        await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=USD`)
            .then((res) => {
                ltcPrice = res.data.USD;
            }).catch((err) => {
                console.error(err);
            });
        withdrawAmtSat = Number(amount/1.4) / ltcPrice;
        withdrawAmtSat = Number((withdrawAmtSat * 100000000).toFixed(0));

        // Sends the withdraw on the api client
        const withdrawData = {
          "currency": `${currency.toLowerCase()}`,
          "transfer-key": `${config.authentication.apirone.transfer_key}`,
          "destinations": [
            {
              "address": address,
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

        // Set values
        newTransaction.txid = withdrawRes.txs[0];
        newTransaction.cryptoValue = Math.abs(
          parseFloat(amount/1.4)
        );
        newTransaction.state = 3;

        // Insert new entry to the db
        await newTransaction.save();
      } else { 
        // Insert new entry to the db
        await newTransaction.save();
      }

      // Log debug info
      console.log(
        colors.blue("Apirone >> New withdraw valued"),
        colors.cyan(`💵 ${amount}`),
        colors.blue("to"),
        colors.cyan(address),
        colors.blue(`(Manual: ${config.site.manualWithdrawsEnabled})`)
      );

      return res.json({
        siteValue: newTransaction.siteValue,
        cryptoValue: newTransaction.cryptoValue,
        state: config.site.manualWithdrawsEnabled ? 4 : 3,
      });
    } catch (error) {
      console.log("Error while completing a withdraw:", error);

      // If the error was related to coinbase
      if (error.name === "ValidationError") {
        console.log(
          colors.red(
            `Apirone >> Error contacting API! Check payment manually! Debug info below:`
          )
        );

        // Construct debug info
        const debug = {
          "User ID": req.user.id,
          "Withdraw wallet address": address,
          "Withdraw amount": amount,
          "Withdraw currency": currency,
        };

        // Print out debug information
        console.table(debug);

        return next(
          new Error(
            "There was a problem while contacting our crypto provider. Please contact support to check your withdraw status!"
          )
        );
      } else {
        return next(error);
      }
    }
  }
);
