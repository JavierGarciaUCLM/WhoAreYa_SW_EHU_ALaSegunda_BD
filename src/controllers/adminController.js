// Controlador para las vistas del panel de administración

// GET /admin - Lista de jugadores
exports.getAdminDashboard = async (req, res) => {
  try {
    res.render("admin/dashboard", {
      title: "Panel de Administración",
      user: req.user || req.session.user,
      token: req.session.token || ""
    });
  } catch (error) {
    res.status(500).render("admin/error", {
      title: "Error",
      message: error.message
    });
  }
};

// GET /admin/login - Vista de login
exports.getLogin = (req, res) => {
  // Si ya está autenticado, redirigir al dashboard
  if (req.session && req.session.token) {
    try {
      const jwt = require("jsonwebtoken");
      const verified = jwt.verify(req.session.token, process.env.JWT_SECRET);
      if (verified.role === "admin") {
        return res.redirect("/admin");
      }
    } catch (err) {
      // Token inválido, continuar con login
    }
  }
  res.render("admin/login", {
    title: "Login - Administración",
    error: null
  });
};

// POST /admin/login - Procesar login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Llamar directamente a la lógica de autenticación (sin hacer petición HTTP)
    const User = require("../models/User");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("admin/login", {
        title: "Login - Administración",
        error: "Credenciales inválidas"
      });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.render("admin/login", {
        title: "Login - Administración",
        error: "Credenciales inválidas"
      });
    }

    // Verificar que sea admin
    if (user.role !== "admin") {
      return res.render("admin/login", {
        title: "Login - Administración",
        error: "No tienes permisos de administrador"
      });
    }

    // Crear token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Guardar token en sesión
    req.session.token = token;
    req.session.user = { name: user.name, role: user.role };
    res.redirect("/admin");
  } catch (error) {
    res.render("admin/login", {
      title: "Login - Administración",
      error: error.message || "Error al iniciar sesión"
    });
  }
};

// GET /admin/logout - Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("admin/error", {
        title: "Error",
        message: "Error al cerrar sesión"
      });
    }
    res.redirect("/admin/login");
  });
};

// GET /admin/players/new - Formulario crear jugador
exports.getNewPlayer = (req, res) => {
  res.render("admin/player-form", {
    title: "Nuevo Jugador",
    player: null,
    action: "create",
    token: req.session.token || ""
  });
};

// GET /admin/players/edit/:id - Formulario editar jugador
exports.getEditPlayer = async (req, res) => {
  try {
    res.render("admin/player-form", {
      title: "Editar Jugador",
      playerId: req.params.id,
      action: "edit",
      token: req.session.token || ""
    });
  } catch (error) {
    res.status(500).render("admin/error", {
      title: "Error",
      message: error.message
    });
  }
};

