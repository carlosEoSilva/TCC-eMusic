// cd C:/Users/carlos/Desktop/ADS/Tcc/eMusic
console.clear();

var flag= 0;

//Dependencias
const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const mongoose= require("mongoose");
const multer= require("multer");
const _= require("lodash");
const app= express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imagem/covers');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload= multer({storage});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/eMusicDB",{useUnifiedTopology: true });

// Banco------------------

// Produtos ------------

const productSchema= new mongoose.Schema({//1
    artista:String,
    album:String,
    tipo:String,
    ano:Number,
    genero:String,
    valor:Number,
    estoque:Number,
    descricao:String,
    img1:String,
    img2:String,
    img3:String
  });

const Product= mongoose.model("Product", productSchema);



// Usuarios---------------

const userSchema= new mongoose.Schema({
    nome:String,
    email:String,
    senha:String,
    cep:String,
    rua:String,
    numero:String,
    cidade:String,
    bairro:String,
    complemento:String,
    tipoEndereco:String,
    uf:String
});

const User= mongoose.model("User", userSchema);


// Métodos Get -----------------
app.route("/")
.get(function(req,res){
    Product.find(function(err,itens){
        if(err){
            console.log(err);
        }else if(flag== 0){
            res.render("index",{album:itens, botao:"Login",link:"/login"});
        }else{
            flag= 0;
            res.render("index",{album:itens, botao:"Sair",link:"/"});
        }
    })
});

app.route("/cadastroUsuario")
.get(function(req,res){
        var cidade= "";
        var bairro= "";
        var rua= "";
        var estado= "";
        var nome= "";
        var email= "";
        var senha= "";
        var cep= "";
        var numero="";
        var complemento="";
        var tipo="";
    res.render("cadastroUsuario", {numero:numero,cep:cep, senha:senha, inputRua:rua,inputBairro:bairro, inputCidade:cidade, inputEstado:estado, nome:nome, email:email,complemento:complemento,tipoEndereco:tipo});
    
});

app.route("/login")
.get(function(req,res){
    res.render("login");
});

app.route("/loginErro")
.get(function(req,res){
    res.render("loginErro");
});

app.route("/mochila")
.get(function(req,res){
    res.render("mochila");
});

app.get("/pagamento",function(req,res){
    res.render("pagamento");
});

app.get("/visualizarProduto",function(req,res){
//app.get("/visualizarProduto/:prodId",function(req,res){
    // var requestedProd= req.params.prodId;
    var requestedProd= "5e7e4aad1e64af225c4fe050";
    // console.log(requestedProd);
    Product.findOne({_id:requestedProd},function(err,prod){
        res.render("visualizarProduto",{artista:prod.artista});
        if(err){
            console.log(err);
        }else{
            console.log(prod.prod.artista);
            
        }
        
    });
    // Product.findOne({_id: requestedProd},function(err,prod){
    //     console.log(prod.artista);
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.render("visualizarProduto",{
                
    //             artista: prod.artista,
    //             album: prod.album,
    //             tipo: prod.tipo,
    //             preco: prod.valor,
    //             descricao: prod.descricao
    //         });
    //     }
        
    // });
    
   res.render("visualizarProduto");
});

app.get("/admin",function(req,res){
    res.render("admin");
});

app.get("/lista", function(req,res){
    Product.find(function(err,itens){
        if(err){
            console.log(err);
        }else{
        res.render("listarProduto",{album:itens});
        }

    })
});

app.get("/cadastroProduto",function(req,res){
    res.render("cadastroProduto");
});

app.get("/listarUsuario",function(req,res){

    User.find(function(err,itens){
        if(err){
            console.log(err);
        }else{
            res.render("listarUsuario",{lista:itens});
        }
    })
    
});

app.get("/alterarUsuario",function(req,res){
    res.render("alterarUsuario");
});
// Métodos Post---------------

app.post("/",function(req,res){
});

app.post("/cadastroUsuario", function(req,res){

        var cep= req.body.cep;
        
        var url= "https://viacep.com.br/ws/"+ cep+ "/json/";

        request(url,function(error,response,body){
            
            var data= JSON.parse(body);
            var estado= data.uf;
            var cidade= data.localidade;
            var bairro= data.bairro;
            var rua= data.logradouro;

            const user= new User({
                nome:req.body.nome,
                email:req.body.email,
                senha:req.body.senha,
                cep:req.body.cep,
                rua:data.logradouro,
                numero:req.body.numero,
                cidade:data.localidade,
                bairro:data.bairro,
                complemento:req.body.complemento,
                tipoEndereco:req.body.tipoEndereco,
                uf:req.body.uf
            });

            user.save();
            
            flag= 1;
            
            
            // User.findOne().sort({$natural: -1}).limit(1).exec(function(err, res){
            //     if(err){
            //         console.log(err);
            //     }
            //     else{
            //         console.log(userId);
            //     }
            // })
          

            });
            res.redirect("/");
        
});

app.post("/listarUsuario",function(req,res){
});

app.post("/alterarUsuario",function(req,res){
    
    var id= req.body.idUs;

        console.log("tudo certo!");
        User.findById(id,function(err,user){
        console.log(user.nome);
        res.render("alterarUsuario", {
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            cep: user.cep,
            inputRua: user.rua,
            numero: user.numero,
            inputCidade: user.cidade,
            inputBairro: user.bairro,
            complemento: user.complemento,
            tipoEndereco: user.tipoEndereco,
            inputEstado: user.uf
        });
    }
)
});

app.post("/login",function(req,res){
    var logEmail= req.body.email;
    var logSenha= req.body.senha;
    console.log(logEmail,logSenha);

    User.findOne({"email":logEmail},{"senha":logSenha},function(err,i){
        if(err){
            console.log(err);
        }else if(i== null){
            console.log("nao encontrado");
            flag= 0;
            res.redirect("/loginErro");
            
        }else{
            console.log("encontrado");
            flag= 1;
            res.redirect("/")
        }
    });
});

app.post("/cadastroProduto", upload.array("image",3), function(req,res){

    var imgPath0 = "imagem/covers/"+ req.files[0].originalname;

    var imgPath1 = "imagem/covers/"+ req.files[1].originalname;

    var imgPath2 = "imagem/covers/"+ req.files[2].originalname;

    let preco= parseFloat(req.body.valor.replace(/,/, '.'));
    
    const produto= new Product({
        artista:req.body.artista,
        album:req.body.album,
        tipo:req.body.midia,
        ano:req.body.ano,
        genero:req.body.genero,
        valor:preco,
        estoque:req.body.estoque,
        descricao:req.body.descricao,
        img1:imgPath0,
        img2:imgPath1,
        img3:imgPath2
    });

    produto.save();
    res.redirect("/admin");
    
});


app.listen(process.env.PORT || 3000,function(){
    console.log();

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    var today = new Date();    
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log("eMusic server running!*******************");
    console.log(date +" "+ time);
});
