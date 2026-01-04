const Leagues = require("../models/Leagues");

const createLeagues = async (req, res, next) => {
  try {
    const created = await Leagues.create(req.body);
    // Ajuste de formato Milestone 4
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

const getLeagues = async (req, res, next) => {
  try {
    const data = await Leagues.find();
    // Ajuste de formato Milestone 4
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    next(err);
  }
};
module.exports = { createLeagues, getLeagues };