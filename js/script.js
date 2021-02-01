function buttonOn() {
    if (confirm('CONFIRMEZ-VOUS D ACTIVER LA VANE ?')) {
        // window.open('page.html', '', '');
        document.getElementById('etat').src = 'im5';
    }
}

function buttonOff() {
    if (confirm('CONFIRMEZ-VOUS DE DESACTIVER LA VANE ?')) {
        document.getElementById('etat').src = 'im4';
    }
}

function dButtonOn() {
    if (confirm('CONFIRMEZ-VOUS D ACTIVER LA VANE ?')) {
        // window.open('page.html', '', '');
        document.getElementById('etat1').src = 'im5';
    }

}

function dButtonOff() {
    if (confirm('CONFIRMEZ-VOUS DE DESACTIVER LA VANE ?')) {
        document.getElementById('etat1').src = 'im4';
    }
}

function tButtonOn() {
    if (confirm('CONFIRMEZ-VOUS D ACTIVER LA VANE ?')) {
        // window.open('page.html', '', '');
        document.getElementById('etat2').src = 'im5';
    }

}

function tButtonOff() {
    if (confirm('CONFIRMEZ-VOUS DE DESACTIVER LA VANE ?')) {
        document.getElementById('etat2').src = 'im4';
    }
}

function qButtonOn() {
    if (confirm('CONFIRMEZ-VOUS D ACTIVER LA VANE ?')) {
        // window.open('page.html', '', '');
        document.getElementById('etat3').src = 'im5';
    }
}

function qButtonOff() {
    if (confirm('CONFIRMEZ-VOUS DE DESACTIVER LA VANE ?')) {
        document.getElementById('etat3').src = 'im4';
    }
}
//creation d'une fonction d'allumage et d'eteignage deuxieme methode

function etatButton(valeurRecu) {
    var etatImage;
    if (valeurRecu == 1) {
        etatImage = "im4";
    } else
        etatImage = "im5";
    //etatImage ne peut pas afficher l'image sur la pasge html pour le faire 
    //il faut rajouter la balise img et recuperer son id
    document.getElementById('img').src = etatImage;
}

var socket = io();
socket.on('temp', function(data) {
    console.log(data);
    var temperature = data.slice(0, 2);
    var humidite = data.slice(5, 7);
    document.getElementById('tempAct').innerHTML = `${temperature}`;
    document.getElementById('HumAct').innerHTML = `${humidite}`;

    // var datHeure = new Date();
    // var heur = datHeure.getHours();
    // var min = datHeure.getMinutes();

    // var numMois = datHeure.getMonth() + 1;
    // if (numMois < 10) {
    //     numMois = '0' + numMois;
    // }
    // var jour = datHeure.getDay(); //le numero du jour de la semaine
    // var seco = datHeure.getSeconds(); //seconde
    // var laDate = datHeure.getFullYear(); // me renvoie en chiffre l'annee
    // var mois = datHeure.getDate(); //renvoie le jour du mois 
    // var data = datHeure.getMonth(); //renvoie le jour du mois
    // var heureEtDate = mois + '/' + numMois + '/' + laDate;
    // document.getElementById('date').innerHTML = heureEtDate;

    //fonction pour changer d'images en fonction de la temperature
    //document.getElementById('img').src = 'im1';
    //     if (temperature <= 26) {
    //         document.getElementById('img').innerHTML = '<img src="/im1" alt="Ambient" title="Temperature < = 26 " style="width:40px; height:44px;">';
    //     } else {
    //         document.getElementById('img').innerHTML = '<img src="/imLogo" alt="Chaud" title="Temperature >= 26 " style="width:40px; height:44px; border-radius: 32px;">';
    //     }
    //     if (temperature <= 26) {
    //         document.getElementById('rectangle2').innerHTML = '<img src="/im" alt="Il fait beau" style="width:auto; height:auto; float:left;">';
    //     } else {
    //         document.getElementById('rectangle2').innerHTML = '<img src="/im2" alt="Il fait chaud" style="width:auto; height:auto; float:left;">';
    //     }
    //     date = new Date();
    //     mois = date.getMonth();
    //     if (mois == (mois + 1) || mois == (mois + 2) || mois == (mois + 6) || mois == (mois + 8) || mois == (mois + 12)) {
    //         document.getElementById('saisonn').innerHTML = "E T E";
    //     }
    //     if (mois == (mois + 3) || mois == (mois + 4) || mois == (mois + 5) || mois == (mois + 7) || mois == (mois + 9) || mois == (mois + 10) || mois == (mois + 11)) {
    //         document.getElementById('saisonn').innerHTML = "H I V E R";
    //     }
    // });

    function Heure() {
        jours = new Array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
        mois = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
        d = new Date;
        if (d.getHours() < 10) { h = "0" + d.getHours() } else { h = d.getHours() }
        if (d.getMinutes() < 10) { min = "0" + d.getMinutes() } else { min = d.getMinutes() }
        if (d.getSeconds() < 10) { sec = "0" + d.getSeconds() } else { sec = d.getSeconds() }
        j = jours[d.getDay()];
        if (d.getDate() < 10) { n = "0" + d.getDate() } else { n = d.getDate() }
        m = mois[d.getMonth()];
        a = d.getYear();
        txt = "Nous sommes le " + j + " " + n + " " + m + " " + a + ", il est : " + h + ":" + min + ":" + sec;
        Calk.innerHTML = txt;
        setTimeout("Heure()", 1000);
    }
    socket.on('MoyTem', function(data) {
        console.log("La moyenne est :" + data);
        document.getElementById('moyeTem').innerHTML = "La moyenne est :" + data;
    });
});