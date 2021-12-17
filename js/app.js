var $ = Dom7;

var app = new Framework7({
  name: 'FatecFood', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element


  // App store
  store: store,
  // App routes
  routes: routes,
  // Register service worker
  serviceWorker: {
    path: '/service-worker.js',
  },
});

var sacola = [];
var textoHTML = "";
var textoWhats = "";
var total = 0.0;


// Login Screen Demo
$('#my-login-screen .login-button').on('click', function () {
  var username = $('#my-login-screen [name="username"]').val();
  var password = $('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');
  
  app.request.post("http://localhost/fatecfood/backend/login.php", { usuario:username, senha: password })
    .then(function (res) {
      const resultado = JSON.parse(res.data);

      if(resultado.status == 200) {
        app.views.main.router.navigate('/cardapio/', { transition: 'f7-cover' })
        localStorage.setItem('usuario', JSON.stringify(resultado));
      } else {
        app.dialog.alert(resultado.mensagem);
        localStorage.setItem('usuario', '');
      }
    });
});

/*
$('.page[data-name="cadastro"]').on('page:afterin', function (e, page) {
  document.getElementById('botaoBuscarCEP').addEventListener('click', buscarCEP);
})
*/

app.on('pageInit', function (page) {
  console.log(page);
});


$(document).on('page:init', '.page[data-name="home"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  alert("oi")
  ListarEmpresa()
})


$(document).on('page:init', '.page[data-name="cardapio"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  ListarCardapio()
})

$(document).on('page:init', '.page[data-name="cardapio-cliente"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  ListarCardapio("cliente")
})

function fecharLogin() {
  app.loginScreen.close('#my-login-screen');
}

function buscarCEP() {

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

function ListarCardapio(tipo = "proprietario") {

  var usuario = JSON.parse(localStorage.getItem("usuario"));

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function() {
    const objCardapio = JSON.parse(this.responseText);
    
    var it = "";
    var disponivel = 1;
    for(var item in objCardapio.itens) {

      if(disponivel == 1 && objCardapio.itens[item].disponivel == 0) {
        it = it + '<li class="item-divider">Indisponíveis</li>'
        disponivel = 0
      }

      it = it + '<li>'
      it = it + '<a href="#" class="item-link item-content"'
      if(tipo == "cliente") {
        it = it + '  onclick="ComprarItem(this)"'
      } else {
        it = it + '  onclick="AlterarItem(this)"'
      }
      it = it + '   data-id="' + objCardapio.itens[item].id + '"'
      it = it + '   data-nome="' + objCardapio.itens[item].nome + '"'
      it = it + '   data-preco="' + objCardapio.itens[item].preco + '"'
      it = it + '   data-descricao="' + objCardapio.itens[item].descricao + '"'
      it = it + '   data-disponivel="' + objCardapio.itens[item].disponivel + '"'
      it = it + '>  <div class="item-media"><img src="http://localhost/fatecfood/backend/' + objCardapio.itens[item].foto + '"'
      it = it + '      width="80" /></div>'
      it = it + '  <div class="item-inner">'
      it = it + '    <div class="item-title-row">'
      it = it + '      <div class="item-title">' + objCardapio.itens[item].nome + '</div>'
      it = it + '      <div class="item-after">R$' + objCardapio.itens[item].preco + '</div>'
      it = it + '    </div>'
      it = it + '    <div class="item-text">' +  objCardapio.itens[item].descricao + '</div>'
      it = it + '  </div>'
      it = it + '</a>'
      it = it + '</li>'
    }
    document.getElementById("lista_cardapio").innerHTML = it;

  }
  xmlhttp.open("GET", "http://localhost/fatecfood/backend/cardapio_lista.php?empresa=" + usuario.id);
  xmlhttp.send();   
}

function ListarEmpresa() {

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function() {
    const objEmpresa = JSON.parse(this.responseText);
    
    var it = "";
    for(var item in objEmpresa.empresas) {

      it = it + '<li>'
      it = it + '<a href="#" class="item-link item-content" onclick="AbrirCardapio(this)"'
      it = it + '   data-id="' + objEmpresa.empresas[item].id + '"'
      it = it + '   data-nome="' + objEmpresa.empresas[item].nome + '"'
      it = it + '   data-foto="' + objEmpresa.empresas[item].foto + '"'
      it = it + '   data-descricao="' + objEmpresa.empresas[item].descricao + '"'
      it = it + '   data-telefone="' + objEmpresa.empresas[item].telefone + '"'
      it = it + '>  <div class="item-media"><img src="http://localhost/fatecfood/backend/' + objEmpresa.empresas[item].foto + '"'
      it = it + '      width="80" /></div>'
      it = it + '  <div class="item-inner">'
      it = it + '    <div class="item-title-row">'
      it = it + '      <div class="item-title">' + objEmpresa.empresas[item].nome + '</div>'
      it = it + '      <div class="item-text">' +  objEmpresa.empresas[item].descricao + '</div>'
      it = it + '    </div>'
      it = it + '  </div>'
      it = it + '</a>'
      it = it + '</li>'
    }
    document.getElementById("lista_empresa").innerHTML = it;

  }
  xmlhttp.open("GET", "http://localhost/fatecfood/backend/empresa_lista.php");
  xmlhttp.send();   
}

function AbrirCardapio(item_da_lista) {
  var id = item_da_lista.dataset.id;
  var nome = item_da_lista.dataset.nome;
  var foto = item_da_lista.dataset.foto;
  var telefone = item_da_lista.dataset.telefone;

  localStorage.setItem('usuario', '{"status":200,"mensagem":"","nome":"'+nome+
    '","telefone":"'+telefone+'","foto":"'+foto+'","id":"'+id+'"}');

  sacola = [];

  app.views.main.router.navigate('/cardapio-cliente/', { transition: 'f7-cover' })
}

function confirmaCadastro() {
  app.dialog.confirm('Confirma o envio do cadastro?', function () {
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
      /*
      app.request.post('auth.php', { username:'foo', password: 'bar' })
      .then(function (res) {
        $$('.login').html(res.data);
        console.log('Load was performed');
      });
      */

      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onload = function() {
        alert(this.responseText);
        if(this.responseText == "Usuário cadastro com sucesso!") {
          //window.location.href = "index.html";
          app.dialog.alert("Usuário cadastro com sucesso!")
        }
      }
      xmlhttp.open("POST", "http://localhost/fatecfood/backend/cadastro.php?nome=" + nome + "&descricao=" + descricao +
              "&cep=" + cep + "&endereco=" + endereco + "&numero=" + numero +
              "&complemento=" + complemento + "&bairro=" + bairro + "&municipio=" + municipio + 
              "&uf=" + uf + "&telefone=" + telefone + "&usuario=" + usuario + "&senha=" + senha);
      xmlhttp.send();    
    } else {
      app.dialog.alert("Confira as senhas digitadas!");
    }
  });
}

function AdicionarItem() {
  var id = document.getElementById("id").value;
  var nome = document.getElementById("nome").innerHTML;
  var descricao = document.getElementById("descricao").innerHTML;
  var preco = document.getElementById("preco").innerHTML;
  var qtd = document.getElementById("qtd").value;
  var observacoes = document.getElementById("observacoes").value;

  sacola.push({id: id, nome: nome, descricao: descricao, preco: preco, qtd: qtd, observacoes: observacoes});

  console.log(sacola);
}

function GravarDados() {
  app.dialog.confirm('Confirma o cadastro do item?', function () {

    var id = document.getElementById("id").value;
    var nome = document.getElementById("nome").value;
    var foto = document.getElementById('foto').files[0];
    var descricao = app.textEditor.get('.text-editor').value;
    var preco = document.getElementById("preco").value;
    var disponivel = app.toggle.get('.toggle');
    var disp = 0;
    if(disponivel.checked) {
      disp = 1;
    }

    var usuario = JSON.parse(localStorage.getItem("usuario"));

    var dadosFormulario = new FormData();
    dadosFormulario.append('id',id);  
    dadosFormulario.append('nome',nome);  
    dadosFormulario.append('foto',foto);
    dadosFormulario.append('descricao',descricao);  
    dadosFormulario.append('preco',preco);  
    dadosFormulario.append('empresa',usuario.id);  
    dadosFormulario.append('disponivel',disp);  

    app.request({
      url: "http://localhost/fatecfood/backend/cardapio.php", 
      method: 'POST',
      data: dadosFormulario,
      mimeType: 'multipart/form-data',
      success: function (res) {

        console.log(res);

        const resultado = JSON.parse(res);

        if(resultado.status == 200) {
          app.dialog.alert("Item cadastro com sucesso!")
          ListarCardapio()

          LimparDados()

          app.popup.close("#novo_cardapio")
        } else {
          app.dialog.alert(resultado.mensagem)
        }
      }
    });
      
  });

}
  
function LimparDados() {
  document.getElementById("id").value = "0";
  document.getElementById("nome").value = "";
  document.getElementById('foto').value = null;
  app.textEditor.get('.text-editor').clearValue();
  document.getElementById("preco").value = "";
}

function AlterarItem(item_da_lista) {

  document.getElementById("id").value = item_da_lista.dataset.id;
  document.getElementById("nome").value = item_da_lista.dataset.nome;
  app.textEditor.get('.text-editor').setValue(item_da_lista.dataset.descricao);
  document.getElementById("preco").value = item_da_lista.dataset.preco; 
  

  app.popup.open("#novo_cardapio")
}

function ComprarItem(item_da_lista) {

  document.getElementById("id").value = item_da_lista.dataset.id;
  document.getElementById("nome").innerHTML = item_da_lista.dataset.nome;
  document.getElementById("descricao").innerHTML = item_da_lista.dataset.descricao;
  document.getElementById("preco").innerHTML = item_da_lista.dataset.preco; 
  

  app.popup.open("#adicionar_item")
}


function MostrarSacola() {
  app.views.main.router.navigate('/sacola/', { transition: 'f7-cover' })
}

$(document).on('page:init', '.page[data-name="sacola"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  
  textoHTML = "";
  textoWhats = "";
  total = 0.0;

  function MontaTexto(item, indice, vetor) {
    textoHTML = textoHTML + '<br><b>' + item.qtd + 'x de ' + item.nome + '</b> - R$ ' + item.preco 
    textoHTML = textoHTML + '<br>' + item.descricao

    textoWhats = textoWhats + '%0A ✔ *' + item.qtd + 'x de ' + item.nome + '* - R$ ' + item.preco 
    textoWhats = textoWhats + '%0A ' + item.descricao

    total = total + parseFloat(item.preco);
  }

  sacola.forEach(MontaTexto);

  textoHTML = textoHTML + "<br> 💲 <b>TOTAL R$ " + total + "</b>";
  textoWhats = textoWhats + "%0A 💲 *TOTAL R$ " + total + "*";
 
  /* 
  whatsapp://send?phone=5511999596179&text= ➡ *NOVO PEDIDO* 29/11 21:11 
  %0A
  %0A ✔ *1x de Torresmo pré assado* R$20,00
  %0A
  %0A 
  %0A ✔ *1x de Tilápia* R$45,00
  %0A Filé de tilápia fresca em tiras, empanada e frita. Acompanha limãozinho, pimenta biquinho e pão redondo francês. (500g de peixe)
  %0A 
  %0A ✅ *CLIENTE* 
  %0Acarlos 
  %0A 
  %0A 💲 *TOTAL R$ 65,00*
  %0A Pedido: R$ 65,00 *RETIRADA*  
  %0A *Forma PGTO:* Crédito MasterCard
  %0A
  %0A*carlos* favor aguardar a resposta confirmando o pedido. 
  %0APara voltar ao cardapio >> https://www.starfood.com.br/seorancho?ped=56soLFQu  ENVIAR PEDIDO OK ✅ 
  */

  document.getElementById("sacola").innerHTML = textoHTML;

})

function confirmaSacola() {
  var textoCliente = "";

  app.dialog.confirm('Confirma o envio do pedido?', function () {
    var nome = document.getElementById("textNome").value;
    var formapagamento = document.getElementById("textFormaPagamento").value;
    var cep = document.getElementById("textCEP").value;
    var endereco = document.getElementById("textEndereco").value;
    var numero = document.getElementById("textNumero").value;
    var complemento = document.getElementById("textComplemento").value;
    var bairro = document.getElementById("textBairro").value;
    //var municipio = document.getElementById("textMunicipio").value;
    //var uf = document.getElementById("textUF").value;
    var telefone = document.getElementById("textTelefone").value;
  
    if(nome == "") {
      app.dialog.alert("Preenche  o seu nome!");
    } else if(endereco == "") {
      app.dialog.alert("Preenche o seu endereço!");
    } else if(numero == "") {
      app.dialog.alert("Preenche o numero de seu endereço!");
    } else if(telefone == "") {
      app.dialog.alert("Preenche o seu telefone!");
    } else if(total = 0) {
      app.dialog.alert("Adicione um item na sua sacola!");
    } else {

      textoCliente = "%0A ✅ *CLIENTE*";
      textoCliente = textoCliente + "%0A " + nome;
      textoCliente = textoCliente + "%0A " + endereco + ", " + numero;
      textoCliente = textoCliente + "%0A " + complemento + " ";
      textoCliente = textoCliente + "%0A " + bairro + " ";
      textoCliente = textoCliente + "%0A CEP: " + cep + " ";
      textoCliente = textoCliente + "%0A " + telefone + " ";

      textoCliente = textoCliente + "%0A%0A *Forma PGTO:* " + formapagamento;

      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onload = function() {
        alert(this.responseText);
        if(this.responseText == "Usuário cadastro com sucesso!") {
          //window.location.href = "index.html";
          app.dialog.alert("Usuário cadastro com sucesso!")
        }
      }
      xmlhttp.open("GET", "whatsapp://send?phone="+telefone+"&text="+textoWhats+textoCliente);
      xmlhttp.send();    
    }
  });

}