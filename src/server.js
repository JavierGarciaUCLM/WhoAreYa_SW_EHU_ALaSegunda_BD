require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

// 1. Conexión a Base de Datos
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesiones
app.use(session({
  secret: process.env.JWT_SECRET || "secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

//Passport
const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// 3. Archivos Estáticos (Imágenes y Frontend)
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../')));

// 4. RUTAS API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/players", require("./routes/players")); 
app.use("/api/teams", require("./routes/teams"));
app.use("/api/leagues", require("./routes/leagues"));

// 5. RUTAS ADMIN (Panel de administración)
app.use("/admin", require("./routes/admin"));

// 5. Arrancar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));