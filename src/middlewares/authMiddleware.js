const jwt = require("jsonwebtoken");

// Verificar Token (para API REST)
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ success: false, message: "Acceso denegado. Token no proporcionado." });

  try {
    // Usamos process.env directamente como decidisteis
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Token inválido" });
  }
};

// Verificar Admin (para API REST)
exports.verifyAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Acceso denegado: Requiere permisos de Administrador" });
    }
  });
};

// Middleware para proteger rutas de admin (vistas HTML)
exports.requireAdminAuth = (req, res, next) => {
  // Verificar si hay token en la sesión
  if (req.session && req.session.token) {
    try {
      const verified = jwt.verify(req.session.token, process.env.JWT_SECRET);
      if (verified.role === "admin") {
        req.user = verified;
        return next();
      }
    } catch (err) {
      // Token inválido, limpiar sesión
      req.session.destroy();
    }
  }

  // Si no está autenticado, redirigir a login
  res.redirect("/admin/login");
};