require("dotenv").config();
const express = require("express");
const connectDB  = require("./config/database");
const LeaguesRoutes = require("./routes/leagues");
const PlayersRoutes = require("./routes/players")
const TeamsRoutes = require("./routes/teams")

const app = express();
app.use(express.json());

app.use("/leagues", LeaguesRoutes);
app.use("/players", PlayersRoutes);
app.use("/teams", TeamsRoutes)


connectDB().then(() => {
  app.listen(3000, () => console.log("HPC server running on port 3000"));
});