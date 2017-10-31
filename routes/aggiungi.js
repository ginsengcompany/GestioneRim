var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
var sudo = require('sudo');

var options = {
    cachePassword: true
};

router.get('/', function (req, res) {
    res.render('aggiungi');
});

router.post('/', function (req, res) {
    var count = 0;
    shell.cd("/etc");
    var items = shell.ls();
    for (var i=0;i<items.length;i++){
        if (/gammu-smsdrc-./.test(items[i]))
            count++;
    }
    count += 1;
    shell.exec("echo 0000 | sudo -S touch /etc/gammu-smsdrc-" + count);
    shell.exec("echo 0000 | sudo -S chmod 777 /etc/gammu-smsdrc-" + count);
    shell.exec("cat /etc/gammu-smsdrc-1 >> /etc/gammu-smsdrc-" + count);
    shell.sed('-i',/\/dev\/gsmmodem/,'/dev/gsmmodem' + count,'/etc/gammu-smsdrc-' + count);
    shell.sed('-i', /GSM[0-9]*/, 'GSM' + count,'/etc/gammu-smsdrc-' + count);
    shell.sed('-i', /phoneid = [0-9]*/, 'phoneid = ' + req.body['phoneid'], '/etc/gammu-smsdrc-' + count);
    var pattern = shell.grep(/\$config\['multiple_modem'\]*/, '/home/aldo/Scrivania/kalkun_settings.php');
    var newPattern = pattern.replace(');\n', '');
    newPattern = newPattern.concat(",'"+req.body['phoneid']+"');");
    shell.sed('-i',/^\$config\['multiple_modem'\] = array.*/,newPattern,'/home/aldo/Scrivania/kalkun_settings.php');
});

module.exports = router;