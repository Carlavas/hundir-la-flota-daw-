<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$ficheroBD = 'resultadosBD.json';

if(file_exists($ficheroBD)){
    echo file_get_contents($ficheroBD);
}else{
    echo json_encode([]);
}

?>