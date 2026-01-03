const Leagues = require("../models/Leagues");

const createLeagues = async (req, res, next) => {
  try {
    const created = await Leagues.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const getLeagues = async (req, res, next) => {
  try {
    const data = await Leagues.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
module.exports = { createLeagues, getLeagues };