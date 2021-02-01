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
// router.get('/', function(req, res) {
//     res.render('index', { text: "Bonjour" });
// });
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
    // TODO

    //fin test
    if ((heur == 08 && min == 00 && sec == 00) || (heur == 12 && min == 00 && sec == 00) || (heur == 19 && min == 00 && sec == 00)) {
        var tempe = parseInt(temperature);
        var humi = parseInt(humidite);
        console.log("En number" + tempe);
        console.log("En chaine de caractere" + temperature);
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
app.get('', (req, res) => {


    //Fonction pour la recuperation de la moyenne temperature
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dhtTemp");
        assert.equal(null, err);
        //Declaration des variables are
        var tempDixNeufHeure;
        var humDixNeufHeure;
        var tempDouzeHeure;
        var humDouzeHeure;
        var tempHuitHeure;
        var humHuitHeure;
        var moyH;
        var moyT;
        //fin
        var col = dbo.collection('tempHum');
        col.aggregate([{ $group: { _id: "_id", moyeTemp: { $avg: "$Temperature" } } }]).toArray(function(err, items) {
            console.log(items);
            moyT = items[0].moyeTemp;
            console.log(moyT);
        });
        //Moyenne humidite donnees
        col.aggregate([{ $group: { _id: "_id", moyeHum: { $avg: "$Humidity" } } }]).toArray(function(err, humi) {
            console.log(humi);
            moyH = humi[0].moyeHum;
            console.log(moyH);
        });
        //recuperation de la temperature de 8h
        col.find({ Heure: "08:00:00" }, { Temperature: 1 }).toArray(function(err, tem1) {
            console.log(tem1);
            tempHuitHeure = tem1[0].Temperature;
            humHuitHeure = tem1[0].Humidity;
            console.log("Temperature Huit heure:\t" + tempHuitHeure);
            console.log("Humidite Huit heure :\t" + humHuitHeure);
        });
        //recuperation de la temperature de 12h
        col.find({ Heure: "12:00:00" }, { Temperature: 1 }).toArray(function(err, tem2) {
            console.log(tem2);
            tempDouzeHeure = tem2[0].Temperature;
            humDouzeHeure = tem2[0].Humidity;
            console.log("Temperature Douze heure:\t" + tempDouzeHeure);
            console.log("Humidite Douze heure :\t" + humDouzeHeure);
        });
        //recuperation de la temperature de 19h
        col.find({ Heure: "19:00:00" }, { Temperature: 1 }).toArray(function(err, tem3) {
            console.log(tem3);
            tempDixNeufHeure = tem3[0].Temperature;
            humDixNeufHeure = tem3[0].Humidity;
            console.log("Temperature Dix neuf heure:\t" + tempDixNeufHeure);
            console.log("Humidite Dix neuf heure :\t" + humDixNeufHeure);
            var objet = [{
                MoyTemperature: moyT,
                MoyHumidite: moyH,
                TempHuitHeure: tempHuitHeure,
                HumiditeHuitHeure: humHuitHeure,
                TemperatureDouzeHeure: tempDouzeHeure,
                HumiditeDouzeHeure: humDouzeHeure,
                TemperatureDixNeufHeure: tempDixNeufHeure,
                HumiditeDixNeufHeure: humDixNeufHeure
            }];
            console.log("L'objet global = \t" + objet);
            res.render('index', { monObjet: objet });
            db.close();
        });

    });


});

//


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