const router = require("express").Router();
const authController = require("../controllers/authController");
const { check, validationResult } = require("express-validator");

const validateRegister = [
  check("name", "Nombre requerido").not().isEmpty(),
  check("email", "Email inválido").isEmail(),
  check("password", "Mínimo 6 caracteres").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);

// Rutas OAuth
const passport = require("passport");
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/admin/login?error=oauth_failed" }), authController.googleCallback);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/admin/login?error=oauth_failed" }), authController.githubCallback);

module.exports = router;