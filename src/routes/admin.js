const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

// Rutas públicas
router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", adminController.logout);

// Rutas protegidas (requieren autenticación admin)
router.get("/", requireAdminAuth, adminController.getAdminDashboard);
router.get("/players/new", requireAdminAuth, adminController.getNewPlayer);
router.get("/players/edit/:id", requireAdminAuth, adminController.getEditPlayer);

module.exports = router;

