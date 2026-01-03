const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: false
    },
    leagueId: {
      type: Number,
      required: false
    },
    logoUrl: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: false
    },
    stadium: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
