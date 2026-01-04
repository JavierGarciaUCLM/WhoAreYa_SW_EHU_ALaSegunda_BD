const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    // Verificar duplicados
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).json({ success: false, message: "El email ya está registrado" });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lógica Milestone 3: Si es el primer usuario en la BD, es admin
    const isFirstAccount = (await User.countDocuments()) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const user = new User({
      name, lastName, email, password: hashedPassword, role
    });

    await user.save();
    res.status(201).json({ success: true, message: "Usuario registrado", data: { email, role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Credenciales inválidas" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ success: false, message: "Credenciales inválidas" });

    // Crear token usando process.env directamente
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.header("Authorization", token).json({ success: true, token, user: { name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};