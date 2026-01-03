const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  playerId:{
      type: Number,
      required: true,
      unique: true,
      index: true
  },
    name: {
      type: String,
      required: true,
      trim: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    teamId: {
      type: Number,
      ref: "Team",
      required: true
    },
    leagueId: {
      type: Number,
      ref: "League",
      required: true
    },
    position: {
      type: String,
      required: true,
      enum: [
        "GK", // Goalkeeper
        "DF", // Defender
        "MF", // Midfielder
        "FW"  // Forward
      ]
    },
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 99
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Players", PlayerSchema);