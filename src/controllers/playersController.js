const Players = require("../models/Players");

const createPlayers = async (req, res, next) => {
  try {
    const created = await Players.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const getPlayers = async (req, res, next) => {
  try {
    const data = await Players.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
module.exports = { createPlayers, getPlayers };