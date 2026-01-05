const router = require("express").Router();
const playersController = require("../controllers/playersController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

// ---------------------------------------------------------
//IMPORTANTE: La ruta "solution" DEBE ir la PRIMERA
// ---------------------------------------------------------
router.get("/solution/:gameNumber", playersController.getSolution); 

// 2. Ruta para traer todos (con soporte para ?limit=5000)
router.get("/", playersController.getPlayers);

// 3. Ruta dinámica por ID (DEBE ir la ÚLTIMA de los GET)
router.get("/:id", playersController.getPlayerById);

// --- Rutas Admin ---
router.post("/", verifyAdmin, playersController.createPlayers);
router.put("/:id", verifyAdmin, playersController.updatePlayer);
router.delete("/:id", verifyAdmin, playersController.deletePlayer);

module.exports = router;