const Teams = require("../models/Teams");

const createTeams = async (req, res, next) => {
  try {
    const created = await Teams.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const getTeams = async (req, res, next) => {
  try {
    const data = await Teams.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
module.exports = { createTeams, getTeams };