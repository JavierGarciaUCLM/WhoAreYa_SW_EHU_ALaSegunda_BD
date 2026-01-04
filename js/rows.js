import { stringToHTML, statsDialog } from "./fragments.js"; 
import { updateStats, getStats } from "./stats.js";

let gameInstance;
// --- FUNCIÓN GLOBAL showStats (Igual que antes) ---
function showStats(timeout = 0) {
    const existing = document.getElementById('statsModal');
    if (existing) {
        existing.remove(); 
        return;            
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = getStats('gameStats');
            const dialogHTML = statsDialog(data);
            const dialogNode = stringToHTML(dialogHTML);
            document.body.appendChild(dialogNode);

            setTimeout(() => {
                const closeBtn = document.getElementById("closedialog");
                if (closeBtn) {
                    closeBtn.onclick = function() {
                        const modal = document.getElementById('statsModal');
                        if (modal) modal.remove();
                    };
                }
            }, 50);

            resolve();
        }, timeout);
    });
}

window.showStats = () => showStats(0);

// -------------------------------------------------------------------

function pad(a, b){
    return(1e15 + a + '').slice(-b);
}

const delay = 350;
// NOTA: Ajustamos 'birthdate' a 'birthDate' para que coincida con la BD si hace falta, 
// pero mejor lo manejamos dentro de la lógica.
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthDate', 'number'];

function initState(storageKey, solutionId) {
    const fullKey = storageKey + '-' + solutionId; 
    
    const storedState = localStorage.getItem(fullKey);

    let state;
    if (storedState) {
        state = JSON.parse(storedState); 
    } else {
        state = { key: fullKey, solutionId, guesses: [] }; 
    }

    function updateState(guessId) {
        state.guesses.push(guessId);
        localStorage.setItem(fullKey, JSON.stringify(state));
    }
    
    return [state, updateState];
}

let setupRows = function (game) {
    gameInstance = game;
    // Aseguramos leer el ID correcto de la solución (por si viene como _id o playerId)
    const solId = game.solution.id || game.solution.playerId || game.solution._id;
    let [state, updateState] = initState('WAYgameState', solId);

    function leagueToFlag(leagueId) {
        const leagueMap = {
            564: "es1", // España
            8:   "en1", // Inglaterra
            82:  "de1", // Alemania
            384: "it1", // Italia
            301: "fr1"  // Francia
        };
        return leagueMap[leagueId] ?? "unknown";
    }

    function getAge(dateString) {
        if (!dateString) return 0; // Evitar error si viene vacío
        const birth = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const hasBirthdayPassed =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() &&
             today.getDate() >= birth.getDate());
        if (!hasBirthdayPassed) age--;
        return age;
    }
    
    let check = function (theKey, theValue) {
        const target = game.solution; 
        
        // CORRECCIÓN: Normalizamos la fecha (birthdate vs birthDate)
        if (theKey === "birthdate" || theKey === "birthDate") {
            const guessDate = theValue;
            const targetDate = target.birthDate || target.birthdate;
            
            const guessedAge = getAge(guessDate);
            const targetAge  = getAge(targetDate);
            
            if (guessedAge === targetAge) return "correct";
            return guessedAge < targetAge ? "higher" : "lower";
        }
        if (theKey === "number") {
            const targetNum = target.number || 0;
            if (theValue === targetNum) return "correct";
            return theValue < targetNum ? "higher" : "lower";
        }
        return target[theKey] === theValue ? "correct" : "incorrect";
    }

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                const mistery = document.getElementById("mistery");
                if(mistery){
                    mistery.classList.remove("hue-rotate-180", "blur");
                    mistery.style.filter = "none"; 
                }
                
                const combo = document.getElementById("combobox");
                if(combo) combo.remove();
                
                let color, text;
                if (outcome=='success'){
                    color =  "bg-blue-500";
                    text = "Awesome";
                } else {
                    color =  "bg-rose-500";
                    text = "The player was " + game.solution.name;
                }
                
                const existingMsg = document.querySelector('.fixed.z-20');
                if (!existingMsg) {
                    const picbox = document.getElementById("picbox");
                    if(picbox) {
                        picbox.innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`;
                    }
                }
                resolve();
            }, 2000);
        });
    }

    function resetInput(){
        const input = document.getElementById("myInput");
        if(input) {
            // Usamos solId calculado arriba
            const isGameOver = game.guesses.includes(solId) || game.guesses.length >= 8;
            
            if (isGameOver) {
                input.placeholder = "Game Over";
                input.disabled = true;
            } else {
                const currentAttempt = game.guesses.length + 1;
                input.placeholder = `Guess ${currentAttempt} of 8`;
            }
        }
    }

    // CORRECCIÓN IMPORTANTE: Buscamos por id O playerId
    let getPlayer = function (playerId) {
        // playerId viene como número del autocomplete, comparamos con ambos por si acaso
        return game.players.find(p => p.id == playerId || p.playerId == playerId);
    }

    function gameEnded(lastGuess){
        return lastGuess === solId || game.guesses.length >= 8;
    }

    function success() {
        updateStats(game.guesses.length);
        unblur('success').then(() => {
            showStats(1000);
        });
    }

    function gameOver() {
        updateStats(9); 
        unblur('failure').then(() => {
            showStats(1000);
        });
    }
    
    // --- RESTAURAR PARTIDA ---
    if (state.guesses.length > 0) {
        game.guesses = [...state.guesses];
        state.guesses.forEach(playerId => {
            let guess = getPlayer(playerId);
            if (guess) {
                let content = setContent(guess);
                showContent(content, guess);
            }
        });

        const lastId = state.guesses[state.guesses.length - 1];
        if (gameEnded(lastId)) {
            const outcome = (lastId === solId) ? 'success' : 'failure';
            unblur(outcome); 
        }
    }

    resetInput();

    // Retorno de la función addRow
    return function (playerId) {
        let guess = getPlayer(playerId);
        
        if (!guess) {
            console.error("Jugador no encontrado con ID:", playerId);
            return;
        }

        console.log("Jugada procesada:", guess);

        let content = setContent(guess);

        // Guardamos el ID correcto (el que coincida con la solución para comparar luego)
        // Normalmente usamos el ID que nos pasan
        game.guesses.push(playerId);
        updateState(playerId); 

        resetInput();

        if (gameEnded(playerId)) {
            if (playerId == solId) {
                success();
            } else if (game.guesses.length >= 8) {
                gameOver();
            }
        }
        showContent(content, guess);
    }
    
    function setContent(guess) {
        // CORRECCIÓN: Leemos la propiedad correcta (birthDate o birthdate)
        const guessDate = guess.birthDate || guess.birthdate;
        const guessNum  = guess.number || 0;

        const ageCheck = check('birthDate', guessDate); // Usamos 'birthDate' para check
        let ageDisplay = `${getAge(guessDate)}`;
        
        if (ageCheck === 'higher') {
            ageDisplay += ' ↑'; 
        } else if (ageCheck === 'lower') {
            ageDisplay += ' ↓';
        }
        
        const numberCheck = check('number', guessNum);
        let numberDisplay = ` ${guessNum} `;
        if (numberCheck === 'higher') {
            numberDisplay += ' ↑';
        } else if (numberCheck === 'lower') {
            numberDisplay += ' ↓';
        }
        
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            ageDisplay,
            numberDisplay
        ]; 
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        // Usamos el array 'attribs' pero mapeando birthDate correctamente
        // Orden en setContent: [Nacionalidad, Liga, Equipo, Posicion, Edad, Numero]
        // Orden en attribs: ['nationality', 'leagueId', 'teamId', 'position', 'birthDate', 'number']
        
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms");
            
            // Truco: Para el check, necesitamos pasar el valor crudo del jugador
            let rawValue = guess[attribs[j]];
            
            // Si es la fecha, normalizamos
            if (attribs[j] === 'birthDate') {
                rawValue = guess.birthDate || guess.birthdate;
            }

            const checkResult = check(attribs[j], rawValue);
            
            fragments += `<div class="w-1/6 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${checkResult == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="width: 60px; height: 60px; min-width: 60px; min-height: 60px; animation-delay: ${s};"> 
                                ${content[j]}
                            </div>
                         </div>`;
        }

        let child = `<div class="flex w-full flex-col text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        <div class="flex w-full flex-nowrap justify-center">
                            ${fragments}
                        </div>`;

        let playersNode = document.getElementById('players');
        playersNode.prepend(stringToHTML(child));
    }
}

// js/rows.js - Al final del archivo

// Función para reiniciar el juego manualmente (borra la memoria y recarga)
window.resetGame = function() {
    // Ahora usamos 'gameInstance' que definimos arriba
    if (!gameInstance || !gameInstance.solution) {
        console.error("No se puede reiniciar: el juego no ha cargado.");
        // Intento de borrado de emergencia (borra todo lo que empiece por WAYgameState)
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('WAYgameState')) localStorage.removeItem(key);
        });
        window.location.reload();
        return;
    }

    const solId = gameInstance.solution.id || gameInstance.solution.playerId || gameInstance.solution._id;
    const fullKey = 'WAYgameState-' + solId;

    console.log("Borrando partida:", fullKey);
    localStorage.removeItem(fullKey);
    window.location.reload();
}

export { setupRows };