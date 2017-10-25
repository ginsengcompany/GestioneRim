var express = require('express');
var router = express.Router();
var tunnel = require('tunnel-ssh');
var mysql = require('../configDatabase/dbConfig');

var config = {
    host: '10.10.13.210',
    port: 22,
    username: 'chrx',
    password: 'usergesan',
    dstPort: 3306,
    keepAlive:true
};

tunnel(config, function(err, result){
    console.log('connected')
});

/* GET home page. */
router.get('/', function(req, res) {
    var listaDati = [];
    var connection = mysql.getMySQLConnection();
    connection.connect(function (err) {
        if(err)
            throw err;
        connection.query('SELECT s.IMEI, s.NUMBER FROM a_sim AS s JOIN phones AS p ON s.IMEI = p.IMEI', function (err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500, "status_message": "internal server error"});
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var dati = {
                        'numero': rows[i].NUMBER,
                        'imei': rows[i].IMEI
                    };
                    listaDati.push(dati);
                }
                res.render('index',{response: listaDati});
            }
        });
    });
});
module.exports = router;
