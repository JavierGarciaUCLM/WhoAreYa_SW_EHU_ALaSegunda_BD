// loaders.js (Versión API)

// Asegúrate de que esta URL es la de tu servidor
const API_URL = 'http://localhost:3000/api'; 

export async function fetchJSON(what) {
  let url;

  if (what === 'fullplayers25') {
    // TRUCO: Pedimos limit=0 o un número muy alto para que la API
    // nos devuelva TODOS los jugadores (necesario para que funcione el buscador)
    url = `${API_URL}/players?limit=5000`; 
  } else if (what === 'solution25') {
    // Calculamos el día para pedir la solución correcta
    const startDate = new Date('2025-01-01'); 
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    url = `${API_URL}/players/solution/${dayNumber}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error API: ${res.status}`);
    }
    const json = await res.json();
    
    // AQUÍ ESTÁ LA CLAVE:
    // Tu API devuelve un objeto { success: true, data: [...] }
    // El juego necesita solo el array que está dentro de 'data'.
    return json.data; 

  } catch (err) {
    console.error("Fallo conectando al backend:", err);
    return []; // Evita que el juego explote si el server está apagado
  }
}

// Estas funciones también deben apuntar a la API
export async function fetchPlayer(playerId) {
    // Si el ID es numérico, lo pedimos directamente
    const res = await fetch(`${API_URL}/players/${playerId}`);
    const json = await res.json();
    return json.data;
}

export async function fetchSolution(gameNumber) {
    const res = await fetch(`${API_URL}/players/solution/${gameNumber}`);
    const json = await res.json();
    return json.data;
}