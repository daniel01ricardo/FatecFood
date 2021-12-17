<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

error_reporting(E_ERROR);

// conecta o banco de dados
$banco = new PDO('mysql:host=localhost;dbname=fatecfood', 'root', '',
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

    /* exibe as variaveis globais para identificar os arquivos e os dados do formulário
    print_r($_FILES);
    print_r($_REQUEST);
    exit();
    */

    $arquivo = 'fotos\\' . date('Ymdhis') . basename($_FILES['foto']['name']);
    
    if (move_uploaded_file($_FILES['foto']['tmp_name'], $arquivo)) {

        $sql = "REPLACE INTO cardapio
        (cardapio_id, cardapio_nome, cardapio_foto, cardapio_descricao, 
        cardapio_preco, cardapio_empresa, cardapio_disponivel)
        VALUES (?, ?, ?, ?, 
        ?, ?, ?)";
    
        $comando = $banco->prepare($sql);
    
        if($comando->execute(array($_REQUEST["id"], $_REQUEST["nome"], $arquivo, $_REQUEST["descricao"], 
            $_REQUEST["preco"], $_REQUEST["empresa"], $_REQUEST["disponivel"]))) {
    
            $resposta["status"] = 200;
            $resposta["mensagem"] = "Produto cadastro com sucesso!";
    
        } else {
            $resposta["status"] = 401;
            $resposta["mensagem"] = "Erro ao cadastrar o produto. Tente novamente!";
        }
    
    } else {
        $resposta["status"] = 401;
        $resposta["mensagem"] = "Erro no upload de arquivo. Tente novamente!";
    }

echo json_encode($resposta);

