<?php
//Cabeceras para que el navegador sepa que enviamos un Json
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

//Establecemos un array asociativo con la flota necesaria para la partida
$barcosObligatorios=[
    ["nombre" => "Portaaviones", "tamanyo" => 5],
    ["nombre" => "Acorazado", "tamanyo" => 4],
    ["nombre" => "Destructor", "tamanyo" => 3],
    ["nombre" => "Submarino", "tamanyo" => 3],
    ["nombre" => "Patrullero", "tamanyo" => 2]
];

//Aquí guardaremos los barcos que se vayan creando con sus coordenadas
$barcosPartida=[];

//Creamos el tablero virtual 10x10. Lo inicializamos vacío, pero nos servirá para saber si "chocan"
$tableroCoordOcupadas=[];

foreach($barcosObligatorios as $barcoInfo){
    $colocado = false;

    //Intentamos colocar el barco, lo intentaremos hasta que tengamos exito --> do...while
    do{
        //Establecemos las coordenadas, aleatoriamente, de 0 a 9 por que nuestro tablero es de 10
        $fila = rand(0,9);
        $columna = rand(0,9);

        //Lo mismo para la orientación aleatoria: 0=horizontal, 1=vertical
        $horizontal = rand(0,1);

        //Guardamos temporalmente las coordenadas ESTE barco que intentemos crear AHORA
        $coordenadasBarco = [];
        $esPosible = true;

        //Verificamos si se crea con éxito (cabe en el mapa y no choca con otro barco)
        for($i=0; $i<$barcoInfo['tamanyo']; $i++){
            //Vamos a colocar el barco
            //Si la horientación es horizontal, sumaremos el tamaño a las columnas puesto que la fila será fija.
            if($horizontal===0){
                $f = $fila;
                $c = $columna + $i;
            }else{ // La horientación vertical, la columna será siempre la misma, sumamos el tamanyo a la fila
                $f = $fila + $i;
                $c = $columna;
            }

            //Una vez posicionado, comprobamos si se sale del tablero $f>9 && $c>9
            if($f>9 || $c>9){
                //El barco se ha posicionado fuera, no es posible crearlo, finalizamos la creación de Este barco
                $esPosible = false;
                break;
            }

            //Hemos comprobado si el barco se ha creado exitosamente en el tablero
            //Vamos a ver si no colisiona con otros barcos ya creados previamente
            if(isset($tableroCoordOcupadas["$f-$c"])){ //si en el tablero ya hay algún barco en la posición "x-y"
                $esPosible=false;
                break;
            }
            //No ha colisionado con un barco ya existente, entonces guardamos las coordenadas temporales
            $coordenadasBarco[] = ["fila" => $f, "col" => $c];
        }
        //Como ha pasado las pruebas vamos a guardar el barco definitivamente :)
        if($esPosible){
            $barcosPartida[] = [
                "nombre" => $barcoInfo["nombre"],
                "tamanyo" => $barcoInfo["tamanyo"],
                "coordenadas" => $coordenadasBarco
            ];

            //Y vamos a guardar las coordenadas que ocupará en nuestro tablero
            foreach($coordenadasBarco as $coord){
                $f = $coord['fila'];
                $c = $coord['col'];
                $tableroCoordOcupadas["$f-$c"] = true;
            }

            $colocado = true;
        }

        

        


    }while(!$colocado);





}

//Enviaremos la respuesta a la BD utilizando Json
echo json_encode($barcosPartida);


?>