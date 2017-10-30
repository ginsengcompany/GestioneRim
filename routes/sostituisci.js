var express = require('express');
var router = express.Router();
var mysql = require('../configDatabase/dbConfig');


/* GET users listing. */
router.get('/', function(req, res, next) {
    var connection = mysql.getMySQLConnection();
    connection.query("SELECT IMEI FROM a_sim WHERE IMEI <> 'SMS1' AND IMEI <> 'SMS2' AND IMEI <> 'SMS3' AND IMEI <> 'SMS4'", function (err, rows, fields) {
        if (err)
          throw err;
        res.render('sostituisci', {oldImei: rows});
    });
});
router.post('/', function (req, res){
    var newImei = req.body.newImeiBody;
    var oldImei = req.body.oldImeiBody;
    console.log(newImei);
    console.log(oldImei);
    var connection = mysql.getMySQLConnection();
    var sql = "UPDATE a_sim SET IMEI = '" + newImei + "' WHERE IMEI = '" + oldImei + "'";
    connection.query(sql, function (err, rows, fields) {
        if (err){
          res.json({'status': 500, 'message': "Errore nell'inserimento"});
        }
        else{
          res.json({'status': 200, 'message': "Inserimento avvenuto con successo"});
        }
    })
});

module.exports = router;
