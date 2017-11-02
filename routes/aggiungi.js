var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
var sudo = require('sudo');
var mysql = require('../configDatabase/dbConfig');

var options = {
    cachePassword: true
};

router.get('/', function (req, res) {
    res.render('aggiungi');
});

router.post('/', function (req, res) {
    var connection = mysql.getMySQLConnection();
    var sql = "SELECT Count(NUMBER) AS numTel FROM a_sim WHERE NUMBER = '" + req.body['phoneid'] +"'" ;
    connection.query(sql, function (err, rows, field) {
        if(err)
            throw  err;
        if (rows[0]['numTel'] > 0 ){
            res.json({'status': 500, 'message': "Numero gi&aacute; esistente"});
        }
        else {
            var count = 0;
            shell.cd("/etc");
            var items = shell.ls();
            for (var i=0;i<items.length;i++){
                if (/gammu-smsdrc-./.test(items[i]))
                    count++;
            }
            count += 1;
            if (shell.exec("echo 0000 | sudo -S touch /etc/gammu-smsdrc-" + count).code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("echo 0000 | sudo -S chmod 777 /etc/gammu-smsdrc-" + count).code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("cat /home/aldo/Scrivania/template-gammu-smsdrc >> /etc/gammu-smsdrc-" + count).code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (count > 1)
                shell.sed('-i',/\/dev\/gsmmodem/,'/dev/gsmmodem' + count,'/etc/gammu-smsdrc-' + count);
            shell.sed('-i', /GSM/, 'GSM' + count,'/etc/gammu-smsdrc-' + count);

            shell.sed('-i', /phoneid = /, 'phoneid = ' + req.body['phoneid'], '/etc/gammu-smsdrc-' + count);
            var pattern = shell.grep(/\$config\['multiple_modem'\]*/, '/home/aldo/Scrivania/kalkun_settings.php');
            var newPattern = pattern.replace(');\n', '');
            newPattern = newPattern.concat(",'"+req.body['phoneid']+"');");
            shell.sed('-i',/^\$config\['multiple_modem'\] = array.*/,newPattern,'/home/aldo/Scrivania/kalkun_settings.php');
            if (shell.exec("echo 0000 | sudo -S touch /lib/systemd/system/gammu" + count + ".service").code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("echo 0000 | sudo -S chmod 777 /lib/systemd/system/gammu" + count + ".service").code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("cat /home/aldo/Scrivania/template-gammu-service >> /lib/systemd/system/gammu" + count + ".service").code !== 0)
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            shell.sed('-i',/Gammu/, 'Gammu ' + count,'/lib/systemd/system/gammu' + count + '.service');
            shell.sed('-i',/smsd-/, 'smsd-' + count,'/lib/systemd/system/gammu' + count + '.service');
            shell.sed('-i',/smsdrc-/,'smsdrc-' + count, '/lib/systemd/system/gammu' + count + '.service');
            res.send({"status": 200, "message": "Il device &egrave; stato aggiunto correttamente"});
        }
    });
});

module.exports = router;