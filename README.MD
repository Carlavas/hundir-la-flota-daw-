Hundir la Flota – Proyecto Intermodular 

Este proyecto implementa una versión web del clásico juego “Hundir la Flota”.
El objetivo principal es practicar la integración de tecnologías Front-End y Back-End mediante el uso de HTML, CSS, JavaScript, PHP y JSON.

Tecnologías utilizadas

HTML5: estructura y maquetación de la interfaz.

CSS3: estilos y diseño del tablero, paneles y modal.

JavaScript:

creación dinámica del tablero,

gestión de disparos,

control de estados (agua, tocado, hundido),

comunicación con el servidor mediante fetch,

actualización del panel de flota y del ranking.

PHP:

generación automática de la flota enemiga,

lectura y escritura de datos en JSON,

simulación de endpoints tipo API.

JSON: intercambio de datos entre cliente y servidor.

Estructura del proyecto

indexFlota.html
Contiene la estructura principal de la interfaz: tablero, panel lateral, marcador de disparos y modal de victoria.

estiloFlota.css
Define los estilos generales del proyecto: grid del tablero, colores, tipografías, organización de paneles y formato del modal.

scriptFlota.js
Lógica del Front-End. Gestiona:

la creación del tablero,

el sistema de disparos,

la detección de impactos, hundimientos y victoria,

el contador de disparos,

las peticiones fetch hacia PHP,

la visualización del ranking.

empezarJuego.php
Genera la flota enemiga aleatoriamente y la devuelve en formato JSON al iniciar la partida.

guardarJuego.php
Recibe la puntuación del jugador (nombre y número de disparos) en formato JSON y la almacena en el archivo resultadosBD.json.

resultadosJuego.php
Envía al cliente el ranking actual leído desde resultadosBD.json.

resultadosBD.json
Archivo local donde se guardan las puntuaciones.

Funcionamiento del juego

Al cargar la página, se solicita al servidor una flota generada aleatoriamente.

Se construye en el navegador un tablero de 10x10 casillas.

Cada disparo incrementa el contador y evalúa si la casilla contiene parte de un barco.

Cuando se acierta una posición:

la casilla se marca como “tocado”,

se actualiza el estado del barco correspondiente

si todas las posiciones de un barco han sido alcanzadas, pasa a “hundido”.

Cuando todos los barcos han sido hundidos:

se bloquean nuevos disparos,

aparece un modal con el total de disparos,

el jugador puede guardar su puntuación.

El ranking se puede consultar desde el panel derecho, cargado directamente desde el archivo JSON mediante PHP.

Endpoints (PHP)
empezarJuego.php

Método: GET

Devuelve una flota generada aleatoriamente en formato JSON.

guardarJuego.php

Método: POST

Recibe un objeto JSON con el nombre del jugador y el número de disparos.

Actualiza resultadosBD.json manteniendo el orden por menor número de disparos.

resultadosJuego.php

Método: GET

Devuelve el ranking completo almacenado en resultadosBD.json.

Ejecución del proyecto

Instalar XAMPP.

Activar el módulo Apache.

Colocar la carpeta del proyecto en:

C:\xampp\htdocs\flota\


Acceder desde el navegador mediante:

http://localhost/flota/indexFlota.html

Organización del repositorio

El repositorio está estructurado mediante ramas para una mejor organización del trabajo:

main: versión estable del proyecto.

Ramas de características (feature/...): destinadas a mejoras específicas, documentación y actualizaciones.

Integración mediante Pull Requests para facilitar la revisión y mantener el historial claro.

Autores

Juan: desarrollo inicial del proyecto, estructura base del juego, maquetación principal y lógica general.

Carla: organización del repositorio, preparación de la documentación, estructura por ramas, mejoras en la lógica del juego y cierre de la entrega.
