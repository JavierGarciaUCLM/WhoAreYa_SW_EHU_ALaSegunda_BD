require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/database");

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el navegador
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// Importar Rutas
const LeaguesRoutes = require("./routes/leagues");
const PlayersRoutes = require("./routes/players");
const TeamsRoutes = require("./routes/teams");
const AuthRoutes = require("./routes/auth"); // <--- NUEVA RUTA

// Definir Rutas (Usamos prefijo /api como pide el PDF)
app.use("/api/auth", AuthRoutes);
app.use("/api/leagues", LeaguesRoutes);
app.use("/api/players", PlayersRoutes);
app.use("/api/teams", TeamsRoutes);

// Conexión a BD y arranque
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});