require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const path = require("path");

const app = express();

// 1. Conexión a Base de Datos
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Archivos Estáticos (Imágenes y Frontend)
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../')));

// 4. RUTAS (Aquí estaba probablemente el error)
app.use("/api/auth", require("./routes/auth"));

// OJO A ESTA LÍNEA: Tiene que ser exactamente "/api/players"
app.use("/api/players", require("./routes/players")); 

app.use("/api/teams", require("./routes/teams"));
app.use("/api/leagues", require("./routes/leagues"));

// 5. Arrancar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));