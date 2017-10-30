var express = require('express');
var router = express.Router();
var tunnel = require('tunnel-ssh');
var mysql = require('../configDatabase/dbConfig');
var shell = require('shelljs');

router.get("/",function (req, res) {
    var connection = mysql.getMySQLConnection();
    connection.query('SELECT COUNT(DISTINCT ID) AS COUNTER FROM kalkun.sentitems WHERE Status= \'SendingError\' AND SequencePosition = 1', function (err, rows, fields) {
        if (err)
            res.status(500).json({"status_code": 500, "status_message": "internal server error"});
        else {
            var counter = rows.COUNTER;
            if (counter > 0)
                res.send("Presenti errori di connessione :" + counter);
            else{
                shell.cd('C:/Users/aldom/Desktop/');
                var str = shell.exec('type script.log');
                var logFormat = str.replace(/[<->]*/g,"");
                res.send(logFormat);
            }
        }
    });
});

module.exports = router;