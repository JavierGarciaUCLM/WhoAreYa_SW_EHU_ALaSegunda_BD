import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from "./rows.js";
import { autocomplete } from "./autocomplete.js";

function differenceInDays(base1) {
  const start = new Date(
    base1.getFullYear(),
    base1.getMonth(),
    base1.getDate()
  );
  const today = new Date();
  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ); 

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffMs = end - start;
  return Math.floor(diffMs / MS_PER_DAY) + 1; 
}

// Nota: La fecha base según tu PDF parece ser Octubre
let difference_In_Days = differenceInDays(new Date("2025-10-01"));

window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

// --- CAMBIO PRINCIPAL: Eliminamos la función getSolution() ---
// Ya no hace falta porque el servidor nos da la solución directa.

Promise.all([
  fetchJSON("fullplayers25"), // Esto devuelve el array de todos los jugadores
  fetchJSON("solution25")     // Esto ahora devuelve UN solo objeto (el jugador solución)
]).then((values) => {

    game.players = values[0];
    game.solution = values[1]; 

    console.log("Solución cargada:", game.solution);

    if (game.solution) {
      const playerId = game.solution.playerId; 
      
      // --- CAMBIO CLAVE ---
      // Como no tenemos las fotos locales, usamos la URL externa oficial.
      // El PDF dice que la ruta es: .../media/players/ (ID % 32) / ID.png
      
      const directory = playerId % 32; // Calculamos la subcarpeta
      document.getElementById("mistery").src = `https://playfootball.games/media/players/${directory}/${playerId}.png`;
    
    }

    // 3. Inicializamos la lógica del juego
    let addRow = setupRows(game); 

    const input = document.getElementById("myInput");
    autocomplete(input, game, addRow);
    
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const playerId = parseInt(input.value, 10);
        if (!isNaN(playerId)) {
          addRow(playerId); 
          input.value = ""; 
        }
      }
    });

  }).catch(err => {
    console.error("Error inicializando el juego:", err);
  });