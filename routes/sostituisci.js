var express = require('express');
var router = express.Router();
var mysql = require('../configDatabase/dbConfig');


router.get('/', function(req, res, next) { //Rotta di accesso alla pagina sostituisci.jade
    var connection = mysql.getMySQLConnection(); //Recupera la connessione al database
    connection.query("SELECT IMEI FROM a_sim WHERE IMEI <> 'SMS1' AND IMEI <> 'SMS2' AND IMEI <> 'SMS3' AND IMEI <> 'SMS4'", function (err, rows, fields) {
        if (err)//Se la query non è andata a buon fine lancia l'errore
          throw err;
        res.render('sostituisci', {oldImei: rows}); //Renderizza la pagina e mostra in una select gli imei già presenti nel database
    });
});
router.post('/', function (req, res){ //Rotta per il servizio di sostituzione della nuova chiavetta
    var newImei = req.body.newImeiBody; //Variabile per memorizzare imei della nuova chiavetta
    var oldImei = req.body.oldImeiBody; // Variabile per memorizza imei della vecchia chiavetta
    var connection = mysql.getMySQLConnection();//Recupera la connessione al database
    var sql = "UPDATE a_sim SET IMEI = '" + newImei + "' WHERE IMEI = '" + oldImei + "'";
    connection.query(sql, function (err, rows, fields) {
        if (err){ //Se la query non è andata a buon fine lancia l'errore
          res.json({'status': 500, 'message': "Errore nell'inserimento"});
        }
        else{
          res.json({'status': 200, 'message': "Inserimento avvenuto con successo"}); //La query è anadata a buon fine restituendo un alert
        }
    })
});

module.exports = router;
