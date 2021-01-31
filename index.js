var http = require('http');
var express = require('express');
var config = require('./config');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var router = express.Router();
var app = express();
var assert = require('assert');
var ws = require('ws');
var server = http.createServer(app);
var mongodb = require('mongodb');
var io = require("socket.io")(server);
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var binary = mongodb.Binary;
//importScripts
var expressLayouts = require('express-ejs-layouts');
// Static Files
app.use(express.static('public'));

// Set Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/full-width');
// Routes
app.get('', (req, res) => {
    res.render('index', { title: 'Home Page' });
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Page', layout: './layouts/sidebar' });
});
app.set('view engine', 'ejs');
app.get('/css', function(req, res) {
    res.sendFile(__dirname + '/css/index.css');
});
app.get('/js', function(req, res) {
    res.sendFile(__dirname + '/js/script.js');
});
// app.get('/im', function(req, res) {
//     res.sendFile(__dirname + '/images/meteo.gif');
// });
// app.get('/im1', function(req, res) {
//     res.sendFile(__dirname + '/images/imVerte1.jpeg');
// });
// app.get('/imLogo', function(req, res) {
//     res.sendFile(__dirname + '/images/imRouge.gif');
// });
// app.get('/im2', function(req, res) {
//     res.sendFile(__dirname + '/images/meteoPresentGirl.gif');
// });
//ici
router.get('/', function(req, res) {
    res.render('index');
});
//la racine pour les fichiers
router.get('/', function(req, res) {
    getFiles(res);
});

var url = "mongodb://localhost:27017/";
server.listen(3000, function() {
    console.log('Demarrage du serveur au port', 3000);
});

var Serialport = require('serialport');
var Readline = Serialport.parsers.Readline;

var port = new Serialport('/dev/ttyUSB0', {
    baudRate: 9600
});
// On lit les donnees par ligne telles quelles apparaissent
var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
parser.on('open', function() {
    console.log('Connexion ouverte');
});

parser.on('data', function(data) {
    console.log(data);
    var temp = parseInt(data);
    console.log(temp);
    var donnee = { 'Humidite': temp };
    io.emit('temp', data);
    console.log(data);
    //decoupe des donnees venant de la carte Arduino
    var temperature = data.slice(0, 2); //decoupe de la temperature
    var humidite = data.slice(5, 7); //decoupe de l'humidite
    //calcul de la date et l'heure 
    var datHeure = new Date();
    var min = datHeure.getMinutes();
    var heur = datHeure.getHours(); //heure
    var sec = datHeure.getSeconds(); //secondes
    var mois = datHeure.getDate(); //renvoie le chiffre du jour du mois 
    var numMois = datHeure.getMonth() + 1; //le mois en chiffre
    var laDate = datHeure.getFullYear(); // me renvoie en chiffre l'annee
    if (numMois < 10) { numMois = '0' + numMois; }
    if (mois < 10) { mois = '0' + mois; }
    if (sec < 10) { sec = '0' + sec; }
    if (min < 10) { min = '0' + min; }
    var heureInsertion = heur + ':' + min + ':' + sec;
    var heureEtDate = mois + '/' + numMois + '/' + laDate;
    if ((heur == 08 && sec == 03) || (heur == 23 && min == 44 && sec == 03) || (heur == 19 && sec == 03)) {
        var tempe = temperature;
        var humi = humidite;
        //l'objet qui contient la temperature, humidite et la date
        var tempEtHum = { 'Temperature': tempe, 'Humidity': humi, 'Date': heureEtDate, 'Heure': heureInsertion };
        //Connexion a mongodb et insertion Temperature et humidite
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("dhtTemp");
            dbo.collection("tempHum").insertOne(tempEtHum, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });

    } //Fin if


});
//ici

//Si on arrive pas a lire sur le port, on affiche l'erreur concernee
port.on('error', function(err) {
    console.log(err);
});

app.use(fileUpload());
router.post("/upload", function(req, res) {
    var file = { name: req.body.name, file: binary(req.files.uploadedFiles.data) };
    insertFile(file, res);
});

function insertFile(file, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, base) {
        if (err) throw err;
        else {
            var db = base.db('dhtTemp');
            var collection = db.collection('donnees');
            try {
                collection.insertOne(file);
                console.log("File Inserted");
            } catch (err) {
                console.log("Erreur lors de l'insertion.", err);
            }
            base.close();
            res.redirect('/');
        }
    });
}

function getFiles(res) {
    MongoClient.connect(Url, { useNewUrlParser: true }, function(err, base) {
        if (err) throw err;
        else {
            var db = base.db('dhtTemp');
            var collection = db.collection('donnees');
            collection.find({}).toArray((err, doc) => {
                if (err) throw err;
                else {
                    var buffer = doc[0].file.buffer;
                    fs.writeFileSync('uploadImage.jpg', buffer);
                }
            });
            base.close();
            res.redirect('/');
        }
    });
}
app.use("/", router);