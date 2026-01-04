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

module.exports = router;