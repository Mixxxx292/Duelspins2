// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { check, validationResult } = require("express-validator");
const { validateJWT } = require("../middleware/auth");
const { checkMaintenance } = require("../middleware/maintenance");
const { generateToken, getSlotData, getSlotURL } = require("../controllers/games/slots");
const config = require("../config");
const axios = require("axios"); 


/**
 * @route   GET /api/slots/
 * @desc    Get possible slot games
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    const p = await getSlotData();
    return res.status(200).json(p);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/slots/game_url
 * @desc    Get possible slot games
 * @access  Public
 */
router.post("/game_url", async (req, res, next) => {
  try {
    const { gameData, user } = req.body;
    const p = await getSlotURL(gameData, user?._id, null);
    return res.status(200).json(p);
  } catch (error) {
    return next(error);
  }
});