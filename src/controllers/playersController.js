const Players = require("../models/Players");

// GET: Listar todos (Paginación + Autocomplete)
const getPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Si limit es muy alto (ej. > 1000), devolvemos todo (útil para el frontend del juego)
    const queryLimit = limit > 1000 ? 0 : limit;

    const players = await Players.find()
      .skip((page - 1) * limit)
      .limit(queryLimit);
      
    const total = await Players.countDocuments();

    // Formato estándar Milestone 4 (success: true)
    res.status(200).json({
      success: true,
      data: players,
      pagination: { total, page, pages: queryLimit ? Math.ceil(total / queryLimit) : 1 }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET: Jugador por ID (Soporta mongo _id y custom playerId)
const getPlayerById = async (req, res) => {
  try {
    let player;
    // Si es un número, buscamos por playerId (del juego)
    if (!isNaN(req.params.id)) {
        player = await Players.findOne({ playerId: req.params.id });
    } else {
        // Si no, buscamos por ID de MongoDB
        player = await Players.findById(req.params.id);
    }

    if (!player) return res.status(404).json({ success: false, message: "Jugador no encontrado" });
    
    res.status(200).json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET: Solución del Juego (Esta es la que te faltaba y daba error)
const getSolution = async (req, res) => {
    try {
        const { gameNumber } = req.params;
        const count = await Players.countDocuments();
        
        if (count === 0) return res.status(404).json({ message: "No hay jugadores en la BD" });

        // Lógica: índice basado en el número de día
        const index = gameNumber % count;
        const solution = await Players.findOne().skip(index);
        
        res.status(200).json({ success: true, data: solution });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST: Crear (Solo Admin)
const createPlayers = async (req, res) => {
  try {
    const created = await Players.create(req.body);
    res.status(201).json({ success: true, data: created, message: "Jugador creado" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT: Editar (Solo Admin)
const updatePlayer = async (req, res) => {
    try {
        const query = !isNaN(req.params.id) ? { playerId: req.params.id } : { _id: req.params.id };
        const updated = await Players.findOneAndUpdate(query, req.body, { new: true });
        
        if (!updated) return res.status(404).json({ success: false, message: "No encontrado" });
        
        res.status(200).json({ success: true, data: updated, message: "Actualizado" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE: Borrar (Solo Admin)
const deletePlayer = async (req, res) => {
    try {
        const query = !isNaN(req.params.id) ? { playerId: req.params.id } : { _id: req.params.id };
        const deleted = await Players.findOneAndDelete(query);
        
        if (!deleted) return res.status(404).json({ success: false, message: "No encontrado" });
        
        res.status(200).json({ success: true, message: "Eliminado" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Exportamos TODAS las funciones para que routes/players.js las encuentre
module.exports = { 
    getPlayers, 
    getPlayerById, 
    getSolution, 
    createPlayers, 
    updatePlayer, 
    deletePlayer 
};