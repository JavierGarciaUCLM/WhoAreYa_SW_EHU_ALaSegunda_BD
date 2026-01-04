const jwt = require("jsonwebtoken");

// Verificar Token
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

// Verificar Admin
exports.verifyAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Acceso denegado: Requiere permisos de Administrador" });
    }
  });
};