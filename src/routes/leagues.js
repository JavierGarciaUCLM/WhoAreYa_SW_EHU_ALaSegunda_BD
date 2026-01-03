const express = require("express");
const { createLeagues, getLeagues } = require("../controllers/leaguesController");
const router = express.Router();

router.post("/", createLeagues);
router.get("/", getLeagues);

module.exports = router;