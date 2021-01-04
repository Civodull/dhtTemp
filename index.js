//Variables environment 
var http = require('http');
var express = require('express');
var socketIO = require('socket.io');
var app = express();
var ws = require('ws');
var server = http.createServer(app);
var io = new socketIO.Server(server);
//app.use(express.static(__dirname + ''));
var meteoJson = require('./index.json');
app.set('view engine', 'ejs');
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/css/index.css');
});
app.get('/js', (req, res) => {
    res.sendFile(__dirname + '/js/script.js');
});
app.get('/im', (req, res) => {
    res.sendFile(__dirname + '/images/meteo.gif');
});
app.get('/im1', (req, res) => {
    res.sendFile(__dirname + '/images/imVerte1.jpeg');
});
app.get('/imLogo', (req, res) => {
    res.sendFile(__dirname + '/images/imRouge.gif');
});
app.get('/im2', (req, res) => {
    res.sendFile(__dirname + '/images/meteoPresentGirl.gif');
});

app.get('/', (req, res) => {
    res.render('index', { donnee: meteoJson });
});

server.listen(3000, function() {
    console.log('Demarrage du serveur au port', 3000);
});
var Serialport = require('serialport');
var Readline = Serialport.parsers.Readline;
var port = new Serialport('/dev/ttyUSB0', {
    baudRate: 9600
});
var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
parser.on('open', function() {
    console.log('Connexion ouverte');
});
parser.on('data', function(data) {
    console.log(data);
    var temp = parseInt(data);
    io.emit('temp', temp);
});
port.on('error', function(err) {
    console.log(err);
});

/*
var express = require('express');
var app = express();
var port = 3000;
var meteoJson = require('./index.json');
app.set('view engine', 'ejs');
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/css/index.css');
});

app.get('/', (req, res) => {
    res.render('index', { donnee: meteoJson });
});

app.listen(port, () => {
    console.log(`Demarrage du serveur au: http://localhost:${port}`);
});*/