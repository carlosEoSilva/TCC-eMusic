console.clear();
const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const mongoose= require("mongoose");

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/", function(req,res){
    res.render("index");
});

app.post("/",function(req,res){
    let button= req.body.botao;
    console.log(button);
});

app.get("/cadastro", function(req,res){
    res.render("cadastroUsuario");
    
});

app.post("/cadastro", function(req,res){
    var cep= req.body.cep;
    var url= "http://apps.widenet.com.br/busca-cep/api/cep.json?code="+ cep;

    request(url,function(error,response,body){
        var data= JSON.parse(body);
        var estado= data.state;
        var cidade= data.city;
        var bairro= data.district;
        var rua= data.address;

        console.log(estado);
        console.log(cidade);
        console.log(bairro);
        console.log(rua);

        document.getElementById('binputAddress2').value="test";

        res.render("cadastroUsuario", {inputRua:rua,inputBairro:bairro, inputCidade:cidade, inputEstado:estado});
    })
    //console.log(data);
});

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/mochila",function(req,res){
    res.render("mochila");
})

app.get("/pagamento",function(req,res){
    res.render("pagamento");
})

app.get("/produto",function(req,res){
    res.render("visualizarProduto");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("eMusic server running!################");
});
