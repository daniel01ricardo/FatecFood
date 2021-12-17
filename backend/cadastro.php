<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// conecta o banco de dados
$banco = new PDO('mysql:host=localhost;dbname=fatecfood', 'root', '',
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

// prepara uma consulta SELECT para verificar se já existe o usuario
$comando = $banco->prepare('SELECT * from empresa WHERE empresa_usuario = ?');

// passa os dados (parametros) para o SELECT
$comando->execute(array($_REQUEST["usuario"]));

if($registro = $comando->fetch()) {
    $resposta["status"] = 402;
    $resposta["mensagem"] = "Usuário já existe!";    
} else {
    
    $sql = "INSERT INTO empresa
	(empresa_id, empresa_nome, empresa_foto, 
    empresa_descricao, empresa_endereco, empresa_numero, 
    empresa_complemento, empresa_bairro, empresa_municipio, 
    empresa_uf, empresa_cep, empresa_telefone, 
    empresa_usuario, empresa_senha)
	VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, md5(?))";

    $comando = $banco->prepare($sql);

    if($comando->execute(array($_REQUEST["nome"], '',
        $_REQUEST["descricao"], $_REQUEST["endereco"], $_REQUEST["numero"],
        $_REQUEST["complemento"], $_REQUEST["bairro"], $_REQUEST["municipio"],
        $_REQUEST["uf"], $_REQUEST["cep"], $_REQUEST["telefone"],
        $_REQUEST["usuario"], $_REQUEST["senha"]))) {

        $resposta["status"] = 200;
        $resposta["mensagem"] = "Usuário cadastro com sucesso!";

    } else {
        $resposta["status"] = 401;
        $resposta["mensagem"] = "Erro ao cadastrar o usuario. Tente novamente!";
    }
}

echo json_encode($resposta);

