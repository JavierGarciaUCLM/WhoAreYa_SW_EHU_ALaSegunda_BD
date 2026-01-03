const express = require("express");
const { createTeams, getTeams } = require("../controllers/TeamsController");
const router = express.Router();

router.post("/", createTeams);
router.get("/", getTeams);

module.exports = router;