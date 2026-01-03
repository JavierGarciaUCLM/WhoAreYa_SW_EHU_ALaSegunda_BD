const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({

  leagueId:{ 
      type: Number,
      required: true,
      unique: true,
      index: true 
    },

  name: { 
    type: String, required:false
  },

  code:{ 
    type: String, required:false 
  },

  pais:{
    type:String, required:false
  },
  
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Leagues", LeagueSchema);