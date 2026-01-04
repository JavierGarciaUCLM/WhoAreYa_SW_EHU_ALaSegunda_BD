const Teams = require("../models/Teams");

const createTeams = async (req, res, next) => {
  try {
    const created = await Teams.create(req.body);
    // Ajuste de formato Milestone 4
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

const getTeams = async (req, res, next) => {
  try {
    const data = await Teams.find();
    // Ajuste de formato Milestone 4
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    next(err);
  }
};
module.exports = { createTeams, getTeams };