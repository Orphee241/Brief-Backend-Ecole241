let express = require("express");
let app = express();
let mysql = require("mysql");

app.use(express.urlencoded({extended:false}));
app.use(express.json())
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootpassword",
    database: "ogoouelabs"
});

//Connection à la BDD
connection.connect((error)=>{
    if(error){
        res.send("Erreur de connexion à la base de données");
    }
    console.log("Connecté à la BDD"); 
});


//On déclare le dossier ou seront stockées le style, les images....
app.use(express.static("public"));

//Hello world
app.get("/helloworld", (req,res)=>{
    res.send("Hello world");
})

//Route permettant de lister tous les élèves
app.get("/listedetousleselevesinscrits", (req, res)=>{

    connection.query("SELECT * FROM candidat", [], (error, results)=>{
        if(error){
            console.log("Data non insérée" + error);
        }
        else{
            console.log("Affichage d'élèves inscrits")
            res.json(results);
            
        }
    })

    
});

//Route d'ajout d'un élève dans la base de données en lui assignant une formation
app.post("/ajoutdunelevedanslabdd", (req,res)=>{ 

    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let age = req.body.age;
    let email = req.body.email;
    let sexe = req.body.sexe;
    let date_inscription = req.body.date_inscription; 
    let diplome = req.body.diplome;
    let niveau_etude = req.body.niveau_etude;
    var formation_titre = req.body.formation_titre;

    let sql = "INSERT INTO candidat (nom, prenom, age, email, sexe, date_inscription, diplome, niveau_etude, formation_titre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(sql, [nom, prenom, age, email, sexe, date_inscription, diplome, niveau_etude, formation_titre], (error, results)=>{
        if(error){
            console.log("Données non isérées " + error);
            res.send("Données non insérées " + error);
        }
        else{
            console.log("Données insérées " + results);
            res.json("Données insérées");
        }
    })
    
})

//Liste des élèves inscrits dans une formation
app.get("/elevesdansuneformation", (req,res)=>{
    let id = 2;
    
    connection.query("SELECT nom, prenom  FROM candidat WHERE formation_titre = ?", ["referent_digital"], (error,result)=>{
        if(error){
            console.log(`Erreur élèves inscrit dans une formation: ${error}`);
            res.send(`Erreur élèves inscrit dans une formation: ${error}`);
        }
        else{
            console.log(`Succès : Elève inscrit dans une formation ${result}`);
            res.json(result);
        }
    })
})

app.get("/listedesformations", (req,res)=>{
    connection.query("SELECT titre FROM formations", [],(error,datas)=>{
        if(error){
            console.log("Erreur liste des formation : " + error);
        }
        else{
            console.log("Succès liste des formations : "+datas);
            res.json(datas);
        }
    })
})

app.listen(3000, ()=>{
    console.log("Connecté au port 3000")
})