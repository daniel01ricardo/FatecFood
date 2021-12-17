<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// conecta o banco de dados
$banco = new PDO('mysql:host=localhost;dbname=fatecfood', 'root', '',
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

// prepara uma consulta SELECT
$comando = $banco->prepare('SELECT * from empresa WHERE empresa_usuario = ? AND empresa_senha = MD5(?)');

// passa os dados (parametros) para o SELECT
$comando->execute(array($_REQUEST["usuario"], $_REQUEST["senha"]));

if($registro = $comando->fetch()) {
    $resposta["status"] = 200;
    $resposta["mensagem"] = "Bem vindo {$registro["empresa_nome"]}!";
    $resposta["nome"] = $registro["empresa_nome"];
    $resposta["telefone"] = $registro["empresa_telefone"];
    $resposta["foto"] = $registro["empresa_foto"];
    $resposta["id"] = $registro["empresa_id"];
} else {
    $resposta["status"] = 401;
    $resposta["mensagem"] = "Acesso negado!";
}

echo json_encode($resposta);

