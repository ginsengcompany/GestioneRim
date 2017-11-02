var express = require('express');
var router = express.Router();
var tunnel = require('tunnel-ssh');
var mysql = require('../configDatabase/dbConfig');
var shell = require('shelljs');
//Rotta utilizzata per recuperare info del file di log
router.get("/",function (req, res) {
    var connection = mysql.getMySQLConnection(); //Recupera la connessione al database
    //Effettua la query
    connection.query('SELECT COUNT(DISTINCT ID) AS COUNTER FROM kalkun.sentitems WHERE Status= \'SendingError\' AND SequencePosition = 1', function (err, rows, fields) {
        if (err) //La query non è andata a buon fine
            res.send("Errore Query"); //Inviamo la risposta al richiedente
        else { //La query è andata a buon fine
            var counter = rows.COUNTER;
            if (counter > 0) //Sono presenti degli errori sulle chiavette
                res.send("Presenti errori di connessione :" + counter); //Inviamo la risposta al richiedente
            else{ //Non sono presenti errori sulle chiavette
                shell.cd('C:/Users/aldom/Desktop/'); //Passiamo alla Directory del file di log
                var str = shell.exec('type script.log'); //Comando di windows per recuperare le info del file di log
                var logFormat = str.replace(/[<->]*/g,""); //Replace per il format della stringa
                res.send(logFormat); //Inviamo la risposta al richiedente
            }
        }
    });
});

module.exports = router;