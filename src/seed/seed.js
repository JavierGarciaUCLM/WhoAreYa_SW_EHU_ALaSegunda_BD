require("dotenv").config();
const connectDB = require("../config/database");

const Player = require("../models/Players");
const Team = require("../models/Teams");
const League = require("../models/Leagues");

const playersData = require("../../json/fullplayers25.json");

const seed = async () => {
  try {
    await connectDB();

    await Player.deleteMany();
    await Team.deleteMany();
    await League.deleteMany();

//Leagues

    const leagueMap = new Map();

    playersData.forEach(p => {
      if (!leagueMap.has(p.leagueId)) {
        leagueMap.set(p.leagueId, { 
            leagueId: p.leagueId,
            imageUrl:'../../data/league_logos/'+p.leagueId+'.png'
        });
      }
    });

    const leagues = await League.insertMany([...leagueMap.values()], { ordered: true });
    const leagueIdToObjectId = new Map(
      leagues.map(l => [l.leagueId, l._id])
    );

   

//Teams
    const teamMap = new Map();

    playersData.forEach(p => {
      if (!teamMap.has(p.teamId)) {
        teamMap.set(p.teamId, {
          teamId: p.teamId,
          logoUrl:'../../data/team_logos/'+p.teamId+'.png'
        });
      }
    });

    const teams = await Team.insertMany([...teamMap.values()]);

    const teamIdToObjectId = new Map(
      teams.map(t => [t.teamId, t._id])
    );

//Players
    const players = playersData.map(p => ({
      playerId: p.id,
      name: p.name,
      birthDate: new Date(p.birthdate),
      nationality: p.nationality,
      teamId: p.teamId,
      leagueId: p.leagueId,
      position: p.position,
      number: p.number,
      imageUrl: '../../data/players/'+p.id+'.png'
    }));

    await Player.insertMany(players);

    console.log("Tablas insertadas");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
