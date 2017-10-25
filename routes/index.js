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
        connection.query('SELECT a_sim.NUMBER, a_sim.SENT AS SentA, a_sim.MONTH_COUNT, a_sim.IMEI, a_sim.EXPIRE_DATE, a_sim.LAST_SENT, phones.ID, phones.Sent AS SentB, IF(NUMBER!=ID,"!","") AS ALERT,'+
            'a_sim.ACTIVE, a_sim.EXIST, a_sim.MONTH_LIMIT, phones.Send, phones.UpdatedInDB,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 1 DAY)) AS ONE_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 2 DAY)) AS TWO_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 3 DAY)) AS THREE_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 4 DAY)) AS FOUR_DAY,'+
            '(SELECT QTY FROM a_dailycounter WHERE a_sim.NUMBER = a_dailycounter.Number AND DATA = DATE_SUB(CURDATE(),INTERVAL 5 DAY)) AS FIVE_DAY '+
        'FROM a_sim '+
        'LEFT JOIN phones ON a_sim.IMEI = phones.IMEI '+
        'order by IMEI', function (err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500, "status_message": "internal server error"});
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var dati = {
                        'number': rows[i].NUMBER,
                        'imei': rows[i].IMEI,
                        'sent_a': rows[i].SentA,
                        'month_count': rows[i].MONTH_COUNT,
                        'phone_id': rows[i].ID,
                        'sent_b': rows[i].SentB,
                        'active': rows[i].ACTIVE,
                        'exist': rows[i].EXIST,
                        'phone_send': rows[i].Send,
                        'update_db': rows[i].UpdatedInDB,
                        'expire_date': rows[i].EXPIRE_DATE,
                        'last_sent': rows[i].LAST_SENT,
                        'alert': rows[i].ALERT,
                        'month_limit':rows[i].MONTH_LIMIT,
                        'send':rows[i].Send,
                        'one_day':rows[i].ONE_DAY,
                        'two_day':rows[i].TWO_DAY,
                        'three_day':rows[i].THREE_DAY,
                        'four_day':rows[i].FOUR_DAY,
                        'five_day':rows[i].FIVE_DAY
                    };
                    listaDati.push(dati);
                }
                res.render('index',{response: listaDati});
            }
        });
    });
});
module.exports = router;
