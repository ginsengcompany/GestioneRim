var express = require('express');
var router = express.Router();
var tunnel = require('tunnel-ssh');
var mysql = require('../configDatabase/dbConfig');
//TODO Da rimuovere al momento del deploy
var config = { //Configurazione del tunnel ssh
    host: '10.10.13.210',
    port: 22,
    username: 'chrx',
    password: 'usergesan',
    dstPort: 3306,
    keepAlive:true
};
// TODO Da rimuovere al momento del deploy
tunnel(config, function(err, result){ //Connessione al tunnel ssh
    console.log('connected')
});

/* GET home page. */
router.get('/', function(req, res) {
    var listaDati = [];
    var connection = mysql.getMySQLConnection(); //Crea la connessione al database
    connection.connect(function (err) { //effettua la connessione
        if(err) //Errore della connessione al database
            throw err;
        //Query per recuperare le info della tabella in index.page
        connection.query('SELECT a_sim.NUMBER, a_sim.SENT AS SentA, a_sim.MONTH_COUNT, a_sim.IMEI, a_sim.EXPIRE_DATE, a_sim.LAST_SENT, phones.ID, phones.Sent AS SentB, IF(NUMBER!=ID,"!","") AS ALERT,'+
            'a_sim.ACTIVE, a_sim.EXIST, a_sim.MONTH_LIMIT, phones.Send, phones.UpdatedInDB,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 1 DAY)) AS ONE_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 2 DAY)) AS TWO_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 3 DAY)) AS THREE_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 4 DAY)) AS FOUR_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 5 DAY)) AS FIVE_DAY '+
        'FROM a_sim '+
        'LEFT JOIN phones ON a_sim.IMEI = phones.IMEI '+
        'order by IMEI; SELECT COUNT(DISTINCT ID) AS COUNTER FROM kalkun.sentitems WHERE Status' +
            '= \'SendingError\' AND SequencePosition = 1', function (err, rows, fields) {
            if (err) { //Errore della query
                res.status(500).json({"status_code": 500, "status_message": "internal server error"});
            } else { //Query eseguita correttamente
                for (var i = 0; i < rows[0].length; i++) { //Creiamo un array di object contenente le info della tabella
                    var dati = {
                        'number': rows[0][i].NUMBER,
                        'imei': rows[0][i].IMEI,
                        'sent_a': rows[0][i].SentA,
                        'month_count': rows[0][i].MONTH_COUNT,
                        'phone_id': rows[0][i].ID,
                        'sent_b': rows[0][i].SentB,
                        'active': rows[0][i].ACTIVE,
                        'exist': rows[0][i].EXIST,
                        'phone_send': rows[0][i].Send,
                        'update_db': rows[0][i].UpdatedInDB,
                        'expire_date': rows[0][i].EXPIRE_DATE,
                        'last_sent': rows[0][i].LAST_SENT,
                        'alert': rows[0][i].ALERT,
                        'month_limit':rows[0][i].MONTH_LIMIT,
                        'send':rows[0][i].Send,
                        'one_day':rows[0][i].ONE_DAY,
                        'two_day':rows[0][i].TWO_DAY,
                        'three_day':rows[0][i].THREE_DAY,
                        'four_day':rows[0][i].FOUR_DAY,
                        'five_day':rows[0][i].FIVE_DAY
                    };
                    listaDati.push(dati); //Inseriamo
                }
                res.render('index',{response: listaDati}); //Inviamo l'array di info come risposta alla richiesta
            }
        });
    });
});
module.exports = router;
