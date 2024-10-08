// Require Dependencies
const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

// Setup WalletTransaction Schema
const WalletTransactionSchema = new mongoose.Schema({
  // Amount that was increased or decreased
  amount: Number,

  // Reason for this wallet transaction
  reason: String,

  // Extra data relating to this transaction
  // game data, crypto transaction data, etc.
  extraData: {
    slotsTxId: {
      type: SchemaTypes.ObjectId,
      ref: "SlotsGame",
    },
    cupsGameId: {
      type: SchemaTypes.ObjectId,
      ref: "CupsGame",
    },
    cupsGameId: {
      type: SchemaTypes.ObjectId,
      ref: "CupsGame",
    },
    battlesGameId: {
      type: SchemaTypes.ObjectId,
      ref: "BattlesGame",
    },
    kingGameId: {
      type: SchemaTypes.ObjectId,
      ref: "KingGame",
    },
    shuffleGameId: {
      type: SchemaTypes.ObjectId,
      ref: "ShuffleGame",
    },
    rouletteGameId: {
      type: SchemaTypes.ObjectId,
      ref: "RouletteGame",
    },
    crashGameId: {
      type: SchemaTypes.ObjectId,
      ref: "CrashGame",
    },
    transactionId: {
      type: SchemaTypes.ObjectId,
      ref: "CryptoTransaction",
    },
    giftcardId: {
      type: String,
      ref: "GiftcardIds",
    },
    couponId: {
      type: SchemaTypes.ObjectId,
      ref: "CouponCode",
    },
    affiliatorId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
    modifierId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
    raceId: {
      type: SchemaTypes.ObjectId,
      ref: "Race",
    },
    triviaGameId: {
      type: SchemaTypes.ObjectId,
      ref: "Trivia",
    },
  },

  // What user does this belong to
  _user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // When document was inserted
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
const WalletTransaction = (module.exports = mongoose.model(
  "WalletTransaction",
  WalletTransactionSchema
));
