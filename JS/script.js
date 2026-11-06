
/* 1. Seleccionar elementos del HTML */

// Seleccionamos el menú de lenguajes.
const lenguaje = document.getElementById("lenguaje");

// Seleccionamos el espacio donde mostraremos los datos.
const resultado = document.getElementById("resultado");

// Seleccionamos el botón de buscar otro repositorio.
const botonBuscar = document.getElementById("botonBuscar");


/*  2. Detectar el lenguaje seleccionado */

// Cuando el usuario cambia el lenguaje,
// se ejecuta la función buscarRepositorio.

lenguaje.addEventListener("change", function() {

    buscarRepositorio();

});


/* 3. Función para buscar repositorios */

// async permite trabajar con solicitudes que tardan
// un tiempo en responder.

async function buscarRepositorio() {

    // Obtenemos el lenguaje seleccionado.
    const seleccionado = lenguaje.value;

    // Si no hay lenguaje, mostramos el estado vacío.
    if (seleccionado === "") {

        resultado.textContent = "Selecciona un lenguaje para comenzar.";

        resultado.classList.remove("error");

        botonBuscar.style.display = "none";

        return;
    }

    // Mostramos el estado de carga.
    resultado.textContent = "Cargando repositorio, espera...";

    resultado.classList.remove("error");

    // Ocultamos el botón mientras se realiza la búsqueda.
    botonBuscar.style.display = "none";

    // Desactivamos el menú durante la consulta.
    lenguaje.disabled = true;

    try {

        /* 4. Consultar la API de GitHub */

        // Construimos la dirección de la API.
        // Buscamos repositorios con más de 10 estrellas.
        const url = "https://api.github.com/search/repositories?q=language:" 
                    + seleccionado + "+stars:>10&per_page=100";

        // fetch realiza la solicitud a GitHub.
        // await espera a que llegue la respuesta.
        const respuesta = await fetch(url);

        // Comprobamos si la solicitud fue exitosa.
        if (!respuesta.ok) {
            throw new Error("Error al consultar GitHub");
        }

        // Convertimos la respuesta en un objeto JavaScript.
        const datos = await respuesta.json();


        /* 5. Comprobar si hay repositorios */

        // Si no encontramos repositorios, mostramos un mensaje.
        if (datos.items.length === 0) {

            resultado.textContent = "No se encontraron repositorios.";

            return;
        }


        /* 6. Elegir un repositorio aleatorio */

        // Obtenemos un número aleatorio.
        const numero = Math.floor(Math.random() * datos.items.length);

        // Seleccionamos un repositorio del arreglo.
        const repositorio = datos.items[numero];


        /* 7. Mostrar la información */

        // Limpiamos el contenido anterior.
        resultado.innerHTML = "";

        // Creamos el nombre del repositorio.
        const nombre = document.createElement("h3");
        nombre.textContent = repositorio.name;

        // Creamos la descripción.
        const descripcion = document.createElement("p");

        descripcion.textContent = repositorio.description || "Sin descripción";

        // Creamos los datos del repositorio.
        const datosRepo = document.createElement("p");

        datosRepo.classList.add("datos");

        datosRepo.textContent =
            "⭐ " + repositorio.stargazers_count +
            " | 🍴 " + repositorio.forks_count +
            " | Issues: " + repositorio.open_issues_count;

        // Creamos un enlace para visitar el repositorio.
        const enlace = document.createElement("a");

        enlace.href = repositorio.html_url;

        enlace.textContent = "Ver en GitHub";

        enlace.target = "_blank";

        enlace.rel = "noopener noreferrer";

        // Agregamos los elementos al resultado.
        resultado.appendChild(nombre);

        resultado.appendChild(descripcion);

        resultado.appendChild(datosRepo);

        resultado.appendChild(enlace);

        // Mostramos el botón para buscar otro repositorio.
        botonBuscar.style.display = "block";


    } catch (error) {

        /*8. Manejar los errores*/

        // Si ocurre un error, mostramos un mensaje.
        resultado.textContent = "Error al buscar repositorios.";

        // Agregamos la clase de error.
        resultado.classList.add("error");

        // Mostramos el botón para intentar nuevamente.
        botonBuscar.textContent = "Intentar nuevamente";

        botonBuscar.style.display = "block";

    } finally {

        // Volvemos a activar el menú cuando termina la consulta.
        lenguaje.disabled = false;

    }

}


/* 9. Boton para buscar otro repositorio */

// Cuando hacemos clic, volvemos a buscar.
botonBuscar.addEventListener("click", function() {

    // Restauramos el texto del botón.
    botonBuscar.textContent = "Buscar otro repositorio";

    // Ejecutamos nuevamente la búsqueda.
    buscarRepositorio();

});
