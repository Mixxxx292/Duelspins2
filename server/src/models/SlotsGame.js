// Require Dependencies
const mongoose = require("mongoose");
const SchemaTypes = mongoose.SchemaTypes;

const SlotsGameSchema = new mongoose.Schema({
  token: String,
  transaction_uuid: String,
  user: SchemaTypes.ObjectId,
  round_closed: Boolean,
  round: String,
  request_uuid: String,
  game_id: Number,
  game_code: String,
  currency: String,
  bet: String,
  betAmount: Number,
  rolled_back: Boolean,

  // When game was rolled
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
const SlotsGame = (module.exports = mongoose.model("SlotsGame", SlotsGameSchema));
