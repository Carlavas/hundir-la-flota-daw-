<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

//Recibimos los datos del JS (nombre y disparos) y lo decodificamos
$jsonRecibido = file_get_contents('php://input');
$datosJugador = json_decode($jsonRecibido, true);

//Verificamos que llegan los datos o paramos
if(!$datosJugador){
    echo json_encode(["status" => "error", "mensaje" => "No has enviado los datos"]);
    exit;
}

//Cargamos el ranking actual
$ficheroDB = 'resultadosBD.json';
$rankingActual = [];

if(file_exists($ficheroDB)){
    //Si el archivo existe, leemos su contenido
    $contenidoFichero = file_get_contents($ficheroDB);
    $rankingActual = json_decode($contenidoFichero, true);

    //Si el archivo estaba vacío o corrupto, nos aseguramos que sea un array
    if(!is_array($rankingActual)){
        $rankingActual = [];
    }
}

//Creamos un nuevo registro para añadir la puntuación
$nuevoRecord = [
    "nombre" => $datosJugador['nombre'],
    "disparos" => $datosJugador['disparos']
];

//Metemos el nuevo jugador en la lista
$rankingActual[] = $nuevoRecord;

//Ordenamos el ranking 
usort($rankingActual, function($a, $b){

    return $a['disparos'] - $b['disparos'];
});

//Mostramos la lista hasta un máximo de 10
$top10 = array_slice($rankingActual, 0, 10);

//Guardamos en el archivo JSON y lo convertimos para que lo entienda Json
$jsonParaGuardar = json_encode($top10, JSON_PRETTY_PRINT);

//Guardamos los cambios
file_put_contents($ficheroDB, $jsonParaGuardar);

//Responder en el navegador que todo ha ido bien
echo json_encode(["status" => "success", "ranking" => $top10]);

?>