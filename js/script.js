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
    document.getElementById('zone1Tem').innerHTML = `${data}`;
    var teperature = `${data}`;
    //fonction pour changer d'images en fonction de la temperature
    //document.getElementById('img').src = 'im1';
    if (data <= 26) {
        document.getElementById('img').setAttribute('src', 'im1');
    } else {
        document.getElementById('img').setAttribute('src', 'imLogo');
    }
    if (data <= 26) {
        document.getElementById('rectangle2').innerHTML = '<img src="/im" alt="Il fait beau" style="width:640px; height:544px; float:left;">';
    } else {
        document.getElementById('rectangle2').innerHTML = '<img src="/im2" alt="Il fait chaud" style="width:640px; height:544px; float:left;">';
    }
});

function date_heure(id) {
    date = new Date;
    annee = date.getFullYear();
    moi = date.getMonth();
    mois = new Array('Janvier', 'F&eacute;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao&ucirc;t', 'Septembre', 'Octobre', 'Novembre', 'D&eacute;cembre');
    j = date.getDate();
    jour = date.getDay();
    jours = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
    h = date.getHours();
    if (h < 10) { h = "0" + h; }
    m = date.getMinutes();
    if (m < 10) { m = "0" + m; }
    s = date.getSeconds();
    if (s < 10) { s = "0" + s; }
    resultat = '' + jours[jour] + ' ' + j + ' ' + mois[moi] + ' ' + annee + ' ' + h + ':' + m + ':' + s;
    document.getElementById(id).innerHTML = resultat;
    setTimeout('date_heure("' + id + '");', '1000');
    return true;
}