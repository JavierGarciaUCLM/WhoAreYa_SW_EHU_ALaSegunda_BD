import { setupRows } from "./rows.js";

export { autocomplete }

// 1. AHORA ACEPTAMOS 'addRow' COMO TERCER PARÁMETRO
function autocomplete(inp, game, addRow) {

    // 2. BORRAMOS LA LÍNEA 'let addRow = setupRows(game);' 
    // porque ya nos pasan la función correcta desde main.js

    let players = game.players;
    let matches;

    let currentFocus;
    
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        for (i = 0; i < players.length; i++) {
            let matchFound = false;

            // Mantenemos tu lógica avanzada de búsqueda (Milestone 6)
            if (window.WAY && typeof window.WAY.match === 'function') {
                matches = window.WAY.match(players[i].name, val, { insideWords: true, findAllOccurrences: true });
                matchFound = (matches && matches.length > 0);
            } else {
                // Fallback por si acaso window.WAY no carga (para evitar errores)
                matchFound = players[i].name.toUpperCase().startsWith(val.toUpperCase());
                // Simulamos estructura matches para el parse simple si fuera necesario
                if(matchFound) matches = []; 
            }

            if (matchFound) {
                // Mantenemos tu lógica de resaltado
                var newName;
                if (window.WAY && typeof window.WAY.parse === 'function') {
                    newName = window.WAY.parse(players[i].name, matches);
                } else {
                    // Fallback simple
                    newName = [{ text: players[i].name, highlight: false }];
                }

                b = document.createElement("DIV");
                b.classList.add('flex', 'items-start', 'gap-x-3', 'leading-tight', 'uppercase', 'text-sm');
                
                // Usamos la URL externa para el escudo del equipo
                b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${players[i].teamId % 32}/${players[i].teamId}.png" width="28" height="28">`;

                const formattedName = newName.map(part =>
                    `<span class="${part.highlight ? "font-bold" : ""}">${part.text}</span>`
                ).join("");

                // IMPORTANTE: Aseguramos que se guarde el ID correcto (playerId o id)
                // Tu objeto players[i] viene del backend, revisa si usa 'id' o 'playerId'
                // Ponemos los dos por seguridad.
                let trueId = players[i].playerId || players[i].id; 

                b.innerHTML += `<div class='self-center'>
                                    ${formattedName}
                                    <input type='hidden' name='name' value='${players[i].name}'>
                                    <input type='hidden' name='id' value='${trueId}'>
                                </div>`;

                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();

                    // Obtenemos el ID del input hidden
                    const idStr = this.getElementsByTagName("input")[1].value;
                    const id = parseInt(idStr, 10);

                    if (!Number.isNaN(id)) {
                        try {
                            // 3. LLAMAMOS A LA FUNCIÓN QUE VINO DE MAIN.JS
                            if (addRow) {
                                addRow(id);
                            } else {
                                console.error("Error: addRow no ha sido pasado a autocomplete");
                            }
                        } catch (err) {
                            console.warn("Error al intentar añadir fila:", err);
                        }
                    }
                });
                a.appendChild(b);
            }
        }
    });

    // ... (El resto de tu código de flechas y closeAllLists sigue igual) ...
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++; // Se incrementa de 1 en 1, no de 2
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--; // Se decrementa de 1 en 1
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

