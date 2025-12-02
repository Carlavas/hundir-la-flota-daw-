let flotaEnemiga=[];
let disparosTotales = 0;

document.addEventListener('DOMContentLoaded', ()=>{
    crearTablero();
    iniciarPartida();
    cargarRanking();
    document.getElementById('formGuardarPuntos').addEventListener('submit', guardarPuntuacion);
});

function crearTablero(){
    const tablero = document.getElementById('tableroJuego');
    //Reiniciamos el tablero
    tablero.innerHTML= '';

    //Bucle para crear las casillas (10 filas y 10 columnas = 100 casillas)
    for(let fila=0; fila<10; fila++){
        for(let col=0; col<10; col++){
            //Creamos el div que se "insertarÃ¡" en el html
            const celda = document.createElement('div');
            //AÃ±adimos propiedad class = casilla
            celda.classList.add('casilla');

            //Guardamos las coordenadas en el propio elemento
            //Para ello usaremos dataset para guardar elementos ocultos
            celda.dataset.fila = fila;
            celda.dataset.col = col;
            //A cada celda le aÃ±adimos su propio id (coord)
            celda.id = `celda-${fila}-${col}`;

            //Añadimos el evento de click para los disparos
            celda.addEventListener('click', disparar);

            //Añadimos la celda al tablero
            tablero.appendChild(celda);
        }
    }
}
function mostrarMensaje(tipo, nombreBarco = '') {
    const mensajeDiv = document.getElementById('mensajeDisparo');
    
    // Limpiamos clases anteriores
    mensajeDiv.className = 'resultadoDisparo';
    
    // Añadimos la clase según el tipo
    mensajeDiv.classList.add(tipo);
    
    // Definimos el mensaje
    let texto = '';
    if (tipo === 'agua') {
        texto = '¡AGUA!';
    } else if (tipo === 'tocado') {
        texto = `¡TOCADO! ${nombreBarco}`;
    } else if (tipo === 'hundido') {
        texto = `¡HUNDIDO! ${nombreBarco}`;
    }
    
    mensajeDiv.textContent = texto;
    
    // Limpiamos el mensaje después de 2 segundos
    setTimeout(() => {
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'resultadoDisparo';
    }, 2000);
}
function disparar(e){
const celda = e.target;

//No podemos disparar dos veces en el mismo sitio
if(celda.classList.contains('disparado')){ //Si ya estÃ¡ coloreada no hacemos nada
    return;
}

disparosTotales++;
document.getElementById('contadorDisparos').innerText = disparosTotales;

//Obtenemos las cordenadas del click, en texto y lo convertimos a n
const filaClick = parseInt(celda.dataset.fila);
const colClick = parseInt(celda.dataset.col);


let dadoEnElBlanco = false;

//Recorremos la flota, cada barco enemigo, ver si coincide con nuestro click
for(let barco of flotaEnemiga){

    //Recorremos las coordenadas del barco
    for(let coord of barco.coordenadas){
        console.log(`Comparando Click(${filaClick}, ${colClick}) con Barco(${coord.fila}, ${coord.col})`);
        if(coord.fila === filaClick && coord.col === colClick){
            console.log("Â¡Impacto en " + barco.nombre + "!");
            
            celda.style.backgroundColor = 'red'; //TOCADO!
            dadoEnElBlanco = true; 
            //AÃ±adimos uno al contador de daÃ±os (vida del barco)
            barco.aciertos++;
            mostrarMensaje('tocado', barco.nombre); 

            //Comprobamos si estÃ¡ hundido
            if(barco.aciertos>=barco.tamanyo){
                console.log("El barco" + barco.nombre + "ha sido Â¡HUNDIDO!");
                mostrarMensaje('hundido', barco.nombre); 
                for(let coordHundido of barco.coordenadas){
                    //Buscamos el div real en el HTML usando el id Ãºnico
                    let idCelda = `celda-${coordHundido.fila}-${coordHundido.col}`;
                    let celdaVisual = document.getElementById(idCelda);
                    //Vamos a cambiarle el estilo a la celda del html
                    if(celdaVisual){
                        celdaVisual.style.backgroundColor='#500e0e';
                        celdaVisual.classList.add('hundido');
                    }
                    
                }
                //Tacharlo de la lista de los barcos
                const divBarcoLista = document.getElementById('barco' + barco.nombre);
                if(divBarcoLista){
                    divBarcoLista.classList.add('tachado');
                }
                comprobarVictoria();
            }else{
                console.log("Â¡TOCADO! " + barco.nombre);
            }
            break;

        }
         
    }
    if(dadoEnElBlanco) break;
}
if(!dadoEnElBlanco){
    console.log("¡Agua!");
    celda.style.backgroundColor='gray';
     mostrarMensaje('agua'); 
}

celda.classList.add('disparado'); //Marcamos la celda como disparada para no repetirla

}


async function iniciarPartida(){
    try{
        const respuesta = await fetch('empezarJuego.php');
        flotaEnemiga = await respuesta.json();

        //Recorremos cada barco y le ponemos el contador (la vida) a 0
        flotaEnemiga.forEach(barco => {
            barco.aciertos = 0;
        });

        console.log("Flota lista con contadores de vida: ", flotaEnemiga);

        pintarPanelFlota();
    
    } catch(error){
        console.error("Error: " + error);
    }
}


function pintarPanelFlota(){
    const contenedor = document.getElementById('listaBarcos');
    contenedor.innerHTML = '';

    flotaEnemiga.forEach(barco => {
        const div = document.createElement('div');
        div.classList.add('barcoItem');

        //ID para cada barco para saber a quien tachamos
        div.id = 'barco' + barco.nombre;

        div.textContent = `${barco.nombre} (${barco.tamanyo} casillas)`;
        contenedor.appendChild(div);
    });

}


function comprobarVictoria(){
    //.every devolverÃ¡ true si TODOS los barcos cumplen la condiciÃ³n
    const todosHundidos = flotaEnemiga.every(barco => barco.aciertos >= barco.tamanyo);

    if(todosHundidos){
        console.log("Â¡Juego terminado! Â¡VICTORIA!");
        mostrarModalFin();
    }

}

function mostrarModalFin(){
    const modal = document.getElementById('modalVictoria');

    //Actualizamos el texto con los disparos finales
    document.getElementById('puntuacionFinal').innerText = disparosTotales;

    //Lo mostramos activando la clase activo
    modal.classList.add('activo');
}


async function guardarPuntuacion(e){
    e.preventDefault();

    const inputNombre = document.getElementById('nombreJugador');
    const nombre = inputNombre.value;

    if(nombre.trim()===""){
        alert("Por favor, escribe tu nombre.");
        return;
    }

    const datosParaEnviar = {
        nombre: nombre,
        disparos: disparosTotales
    };

    try{
        //Enviamos el paquete al php usando FETCH 
        const respuesta = await fetch('guardarJuego.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosParaEnviar)
        });

        const resultado = await respuesta.json();

        console.log("Respuesta del servidor: ", resultado);

        if(resultado.status === "success"){
            alert("PuntuaciÃ³n guardada");

            //Ocultamos el modal
            document.getElementById('modalVictoria').classList.remove('activo');

            //Recargamos la pÃ¡gina para jugar de nuevo
            location.reload();

        }else{
            alert("Error al guardar: " + resultado.mensaje);
        }
    }catch (error){
        console.error("Error en la peticiÃ³n: ", error);
    }
}



async function cargarRanking(){
    try{
        const respuesta = await fetch('resultadosJuego.php');
        const ranking = await respuesta.json();

        const lista = document.getElementById('listaPuntuaciones');
        lista.innerHTML = '';

        ranking.forEach(jugador =>{
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} - ${jugador.disparos} disparos`;
            lista.appendChild(li);
        })
    }catch (error){
        console.error("Error al cargar el ranking", error);
    }
}

