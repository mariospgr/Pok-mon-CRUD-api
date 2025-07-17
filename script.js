$(document).ready(function() {
    const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";
    let todosLosPokemon = [];
    let equipoSeleccionado = [];
    const equiposKey = 'equiposPokemonGuardados';

    // Diccionario de nombres en español
    const nombresES = {
        'bulbasaur': 'Bulbasaur', 'ivysaur': 'Ivysaurio', 'venusaur': 'Venusaurio', 'charmander': 'Charmander',
        'charmeleon': 'Charmeleon', 'charizard': 'Charizard', 'squirtle': 'Ardilla', 'wartortle': 'Wartortle',
        'blastoise': 'Blastoise', 'caterpie': 'Oruga', 'metapod': 'Metapodo', 'butterfree': 'Sin Mantequilla',
        'weedle': 'Hierba Mala', 'kakuna': 'Kakuna', 'beedrill': 'Taladro De Beedrill', 'pidgey': 'Pidgey'
    };

    // Cargar Pokémon desde la API
    function cargarPokemonDesdeAPI() {
        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function(data) {
                todosLosPokemon = data.results.map((pokemon, i) => ({
                    nombre: pokemon.name,
                    url: pokemon.url,
                    numero: i + 1,
                    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`
                }));
                renderizarListaPokemon(todosLosPokemon);
            },
            error: function(error) {
                $("#listaPokemon").html("<div style='color:red'>Error al cargar Pokémon</div>");
            }
        });
    }

    // Renderizar lista de Pokémon disponibles
    function renderizarListaPokemon(lista) {
        const equipoNombres = equipoSeleccionado.map(p => p.nombre);
        $("#listaPokemon").html(
            lista.map(pokemon => `
                <div class="pokemonCard${equipoNombres.includes(pokemon.nombre) ? ' enEquipo' : ''}" data-nombre="${pokemon.nombre}">
                    <img src="${pokemon.sprite}" alt="${pokemon.nombre}" style="cursor:pointer;">
                    <p>${nombresES[pokemon.nombre] || pokemon.nombre}</p>
                </div>
            `).join("")
        );
    }

    // Habilitar/deshabilitar el botón Guardar según la cantidad de pokemones
    function actualizarBotonGuardar() {
        if (equipoSeleccionado.length === 6) {
            $("#guardarEquipo").prop("disabled", false);
        } else {
            $("#guardarEquipo").prop("disabled", true);
        }
    }

    // Renderizar equipo seleccionado y controles
    function renderizarEquipo() {
        let html = '';
        if (equipoSeleccionado.length === 0) {
            html += '<div style="color:#888;font-style:italic;padding:20px;text-align:center;">Aún no hay Pokémon seleccionados</div>';
        } else {
            html += equipoSeleccionado.map((pokemon, idx) => `
                <div class="equipoCard">
                    <img src="${pokemon.sprite}" alt="${pokemon.nombre}">
                    <span class="apodo">${pokemon.apodo ? pokemon.apodo : (nombresES[pokemon.nombre] || pokemon.nombre)}</span>
                    <button class="quitar" data-nombre="${pokemon.nombre}">Quitar</button>
                </div>
            `).join("");
            html += `<div style="margin-top:16px;text-align:center;">
                <button id="borrarListaEquipo" style="background:#ff3e3e;color:#fff;padding:10px 18px;border:none;border-radius:6px;font-size:1rem;">Borrar lista completa</button>
            </div>`;
        }
        $("#equipoPokemon").html(html);
        actualizarBotonGuardar();
    }

    // Buscar Pokémon
    $(document).on("input", "#busquedaPokemon", function() {
        const termino = $(this).val().toLowerCase();
        const filtrados = todosLosPokemon.filter(p => (nombresES[p.nombre] || p.nombre).toLowerCase().includes(termino));
        renderizarListaPokemon(filtrados);
    });

    // Seleccionar Pokémon al hacer click en la imagen
    $(document).on("click", ".pokemonCard img", function() {
        const nombre = $(this).closest('.pokemonCard').data("nombre");
        const pokemon = todosLosPokemon.find(p => p.nombre === nombre);
        if (pokemon && equipoSeleccionado.length < 6 && !equipoSeleccionado.some(p => p.nombre === nombre)) {
            equipoSeleccionado.push({...pokemon});
            renderizarEquipo();
            renderizarListaPokemon(todosLosPokemon);
        }
    });

    // Quitar Pokémon del equipo
    $(document).on("click", ".quitar", function() {
        const nombre = $(this).data("nombre");
        equipoSeleccionado = equipoSeleccionado.filter(p => p.nombre !== nombre);
        renderizarEquipo();
        renderizarListaPokemon(todosLosPokemon);
    });

    // Editar apodo de Pokémon
    $(document).on("click", ".editar", function() {
        const nombre = $(this).data("nombre");
        const idx = equipoSeleccionado.findIndex(p => p.nombre === nombre);
        if (idx !== -1) {
            const nuevoApodo = prompt("Introduce un apodo para este Pokémon:", equipoSeleccionado[idx].apodo || (nombresES[equipoSeleccionado[idx].nombre] || equipoSeleccionado[idx].nombre));
            if (nuevoApodo !== null && nuevoApodo.trim() !== "") {
                equipoSeleccionado[idx].apodo = nuevoApodo.trim();
                renderizarEquipo();
            }
        }
    });

    // Guardar equipo en localStorage
    $(document).on("click", "#guardarEquipo", function() {
        let error = false;
        const nombreUsuario = $("#nombreUsuario").val().trim();
        const correoUsuario = $("#correoUsuario").val().trim();
        $("#nombreUsuario, #correoUsuario").css({borderColor: '#ccc', background: '#fff'});
        $("#mensajeInput").remove();
        if (!nombreUsuario) {
            $("#nombreUsuario").css({borderColor: '#ff3e3e', background: '#fff0f0'});
            $("#nombreUsuario").after('<div id="mensajeInput" style="color:#ff3e3e;font-size:0.95rem;margin-top:2px;">Escribe tu nombre</div>');
            error = true;
        }
        if (!correoUsuario) {
            $("#correoUsuario").css({borderColor: '#ff3e3e', background: '#fff0f0'});
            $("#correoUsuario").after('<div id="mensajeInput" style="color:#ff3e3e;font-size:0.95rem;margin-top:2px;">Escribe tu correo electrónico</div>');
            error = true;
        }
        if (error) {
            return;
        }
        if (equipoSeleccionado.length !== 6) {
            $("#mensajeGuardado").text("Debes seleccionar exactamente 6 pokemones para guardar el equipo.");
            setTimeout(() => { $("#mensajeGuardado").text(""); }, 2000);
            return;
        }
        const nuevoEquipo = {
            nombre: nombreUsuario,
            correo: correoUsuario,
            equipo: equipoSeleccionado
        };
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        equipos.push(nuevoEquipo);
        localStorage.setItem(equiposKey, JSON.stringify(equipos));
        $("#mensajeGuardado").text("¡Equipo guardado exitosamente! Puedes crear un nuevo equipo.");
        equipoSeleccionado = [];
        $("#nombreUsuario").val("");
        $("#correoUsuario").val("");
        renderizarEquipo();
        renderizarListaPokemon(todosLosPokemon);
        setTimeout(() => { $("#mensajeGuardado").text(""); }, 2000);
    });

    // Mostrar todas las listas guardadas
    function mostrarListaGuardada() {
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        let html = '';
        equipos.forEach((datos, idx) => {
            if (datos && Array.isArray(datos.equipo) && datos.equipo.length > 0) {
                html += `<div class="listaGuardada" data-idx="${idx}" style="margin-top:24px;padding:16px;background:#f8f9fa;border-radius:10px;">
                    <h3 style="margin-bottom:10px;color:#2196f3;">Equipo guardado</h3>
                    <div><strong>Nombre:</strong> <span id="nombreGuardado${idx}">${datos.nombre || ''}</span>
                        <button class="editarNombre" data-idx="${idx}" style="margin-left:8px;padding:2px 8px;border-radius:5px;background:#2196f3;color:#fff;border:none;font-size:0.9rem;">Editar</button>
                        <button class="borrarNombre" data-idx="${idx}" style="margin-left:4px;padding:2px 8px;border-radius:5px;background:#ff3e3e;color:#fff;border:none;font-size:0.9rem;">Borrar</button>
                    </div>
                    <div><strong>Correo:</strong> <span id="correoGuardado${idx}">${datos.correo || ''}</span>
                        <button class="editarCorreo" data-idx="${idx}" style="margin-left:8px;padding:2px 8px;border-radius:5px;background:#2196f3;color:#fff;border:none;font-size:0.9rem;">Editar</button>
                        <button class="borrarCorreo" data-idx="${idx}" style="margin-left:4px;padding:2px 8px;border-radius:5px;background:#ff3e3e;color:#fff;border:none;font-size:0.9rem;">Borrar</button>
                    </div>
                    <div style="margin-top:10px;"><strong>Pokémon:</strong></div>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
                        ${datos.equipo.map(p => `<div style='display:flex;align-items:center;gap:6px;background:#fff;padding:6px 12px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.05);'>
                            <img src='${p.sprite}' alt='${p.nombre}' width='32' height='32'>
                            <span>${p.apodo ? p.apodo : (nombresES[p.nombre] || p.nombre)}</span>
                        </div>`).join('')}
                    </div>
                    <div style="margin-top:16px;text-align:center;">
                        <button class="borrarEquipoGuardado" data-idx="${idx}" style="background:#ff3e3e;color:#fff;padding:8px 18px;border:none;border-radius:6px;font-size:1rem;">Borrar equipo guardado</button>
                    </div>
                </div>`;
            }
        });
        $(".listaGuardada").remove();
        $("#mensajeGuardado").after(html);
    }

    // Eventos para editar/borrar nombre y correo en la lista guardada
    $(document).on("click", ".editarNombre", function() {
        const idx = $(this).data("idx");
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        const nuevoNombre = prompt("Editar nombre:", equipos[idx].nombre);
        if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
            equipos[idx].nombre = nuevoNombre.trim();
            localStorage.setItem(equiposKey, JSON.stringify(equipos));
            mostrarListaGuardada();
        }
    });
    $(document).on("click", ".borrarNombre", function() {
        const idx = $(this).data("idx");
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        equipos[idx].nombre = "";
        localStorage.setItem(equiposKey, JSON.stringify(equipos));
        mostrarListaGuardada();
    });
    $(document).on("click", ".editarCorreo", function() {
        const idx = $(this).data("idx");
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        const nuevoCorreo = prompt("Editar correo:", equipos[idx].correo);
        if (nuevoCorreo !== null && nuevoCorreo.trim() !== "") {
            equipos[idx].correo = nuevoCorreo.trim();
            localStorage.setItem(equiposKey, JSON.stringify(equipos));
            mostrarListaGuardada();
        }
    });
    $(document).on("click", ".borrarCorreo", function() {
        const idx = $(this).data("idx");
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        equipos[idx].correo = "";
        localStorage.setItem(equiposKey, JSON.stringify(equipos));
        mostrarListaGuardada();
    });
    $(document).on("click", ".borrarEquipoGuardado", function() {
        const idx = $(this).data("idx");
        let equipos = JSON.parse(localStorage.getItem(equiposKey) || '[]');
        equipos.splice(idx, 1);
        localStorage.setItem(equiposKey, JSON.stringify(equipos));
        mostrarListaGuardada();
        $("#mensajeGuardado").text("Equipo guardado eliminado correctamente.");
        $("#nombreUsuario").val("");
        $("#correoUsuario").val("");
        equipoSeleccionado = [];
        renderizarEquipo();
        renderizarListaPokemon(todosLosPokemon);
        setTimeout(() => { $("#mensajeGuardado").text(""); }, 2000);
    });

    // Mostrar la lista guardada al iniciar y después de guardar
    $(document).ready(function() {
        mostrarListaGuardada();
    });
    $(document).on("click", "#guardarEquipo", function() {
        setTimeout(mostrarListaGuardada, 500);
    });

    // Borrar lista completa
    $(document).on("click", "#borrarListaEquipo", function() {
        equipoSeleccionado = [];
        renderizarEquipo();
        renderizarListaPokemon(todosLosPokemon);
    });

    // Inicialización
    cargarPokemonDesdeAPI();
    renderizarEquipo();
    actualizarBotonGuardar();
});
