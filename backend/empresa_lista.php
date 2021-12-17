<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// conecta o banco de dados
$banco = new PDO('mysql:host=localhost;dbname=fatecfood', 'root', '',
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

// prepara uma consulta SELECT
$comando = $banco->prepare('SELECT empresa_id, empresa_nome, empresa_foto, empresa_descricao, empresa_telefone
FROM empresa
ORDER BY empresa_nome
');

// passa os dados (parametros) para o SELECT
$comando->execute(array());

$resposta["status"] = 200;
$resposta["empresas"] = array();
while($registro = $comando->fetch()) {
    $item["id"] = $registro["empresa_id"];
    $item["nome"] = $registro["empresa_nome"];
    $item["foto"] = $registro["empresa_foto"];
    $item["descricao"] = $registro["empresa_descricao"];
    $item["telefone"] = $registro["empresa_telefone"];

    array_push($resposta["empresas"], $item);
}

echo json_encode($resposta);

