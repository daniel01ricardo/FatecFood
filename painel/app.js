function login(event) {
    event.preventDefault();

    var usuario = document.getElementById("textUsuario").value;
    var senha = document.getElementById("textSenha").value;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
      alert(this.responseText);
    }
    xmlhttp.open("POST", "../backend/login.php?usuario=" + usuario + "&senha=" + senha);
    xmlhttp.send();    

}

function cadastrar(event) {
  event.preventDefault();

  var nome = document.getElementById("textNome").value;
  var descricao = document.getElementById("textDescricao").value;
  var cep = document.getElementById("textCEP").value;
  var endereco = document.getElementById("textEndereco").value;
  var numero = document.getElementById("textNumero").value;
  var complemento = document.getElementById("textComplemento").value;
  var bairro = document.getElementById("textBairro").value;
  var municipio = document.getElementById("textMunicipio").value;
  var uf = document.getElementById("textUF").value;
  var telefone = document.getElementById("textTelefone").value;
  var usuario = document.getElementById("textUsuario").value;
  var senha = document.getElementById("textSenha").value;
  var senha2 = document.getElementById("textSenha2").value;

  if(senha == senha2) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
      alert(this.responseText);
      if(this.responseText == "Usuário cadastro com sucesso!") {
        window.location.href = "index.html";
      }
    }
    xmlhttp.open("POST", "../backend/cadastro.php?nome=" + nome + "&descricao=" + descricao +
            "&cep=" + cep + "&endereco=" + endereco + "&numero=" + numero +
            "&complemento=" + complemento + "&bairro=" + bairro + "&municipio=" + municipio + 
            "&uf=" + uf + "&telefone=" + telefone + "&usuario=" + usuario + "&senha=" + senha);
    xmlhttp.send();    
  } else {
    alert("Confira as senhas digitadas!");
  }

}

function buscarCEP(event) {
  event.preventDefault();

  var cep = document.getElementById("textCEP").value;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function() {
    //alert(this.responseText);
    const objCEP = JSON.parse(this.responseText);

    document.getElementById("textEndereco").value = objCEP.logradouro;
    document.getElementById("textComplemento").value = objCEP.complemento;
    document.getElementById("textBairro").value = objCEP.bairro;
    document.getElementById("textMunicipio").value = objCEP.localidade;
    document.getElementById("textUF").value = objCEP.uf;
  
    //document.getElementById("textEndereco").readOnly = true;
    //document.getElementById("textMunicipio").readOnly = true;
  }
  xmlhttp.open("GET", "https://viacep.com.br/ws/" + cep + "/json");
  xmlhttp.send();   
}

