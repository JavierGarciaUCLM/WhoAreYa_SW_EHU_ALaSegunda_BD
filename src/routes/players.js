const express = require("express");
const { createPlayers, getPlayers } = require("../controllers/playersController");
const router = express.Router();

router.post("/", createPlayers);
router.get("/", getPlayers);

module.exports = router;