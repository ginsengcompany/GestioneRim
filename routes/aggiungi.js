var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var mysql = require('../configDatabase/dbConfig');

router.get('/', function (req, res) { //Rotta di accesso alla pagina aggiungi.jade
    res.render('aggiungi');
});

router.post('/', function (req, res) { //Rotta per il servizio di aggiunta della nuova chiavetta
    var connection = mysql.getMySQLConnection(); //Recupera la connessione al database
    //Query che effettua il count del nuovo numero inserito per controllare se è già presente nel database
    var sql = "SELECT Count(NUMBER) AS numTel FROM a_sim WHERE NUMBER = '" + req.body['phoneid'] +"'";
    connection.query(sql, function (err, rows, field) { //Esegue la query
        if(err) //Se la query non è andata a buon fine lancia l'errore
            throw  err;
        if (rows[0]['numTel'] > 0 ){ //La query è andata a buon fine ma il numero è già presente nel database
            res.json({'status': 500, 'message': "Numero gi&aacute; esistente"});
        }
        else { //La query è andata a buon fine e il nuovo numero è già presente nel database
            var count = 0;
            shell.cd("/etc"); //Passiamo alla directory /etc per eseguire il comando ls e capire il numero di chiavette presenti
            var items = shell.ls();
            for (var i=0;i<items.length;i++){
                if (/gammu-smsdrc-./.test(items[i]))
                    count++;
            }
            count += 1;
            // TODO Cambiare il path per tornare al progetto
            //Passiamo alla directory del progetto in modo da poter utilizzare i template dei file di configurazione
            shell.cd("/home/aldo/Scrivania/RIM/GestioneRim");
            if (shell.exec("echo 0000 | sudo -S touch /etc/gammu-smsdrc-" + count).code !== 0) //creiamo il file gammu-smsdrc-*
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("echo 0000 | sudo -S chmod 777 /etc/gammu-smsdrc-" + count).code !== 0) //modifichiamo i permessi del file
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("cat templates/template-gammu-smsdrc >> /etc/gammu-smsdrc-" + count).code !== 0) //copiamo il template gammu-smsdrc nel file appena creato
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (count > 1) //Se non è la prima chiavetta viene modificato un campo all'interno del nuovo file
                shell.sed('-i',/\/dev\/gsmmodem/,'/dev/gsmmodem' + count,'/etc/gammu-smsdrc-' + count);
            shell.sed('-i', /GSM/, 'GSM' + count,'/etc/gammu-smsdrc-' + count); //Modifichiamo il campo GSM del nuovo file
            shell.sed('-i', /phoneid = /, 'phoneid = ' + req.body['phoneid'], '/etc/gammu-smsdrc-' + count); //Modifichiamo il campo phoneid del nuovo file
            // TODO Cambiare il path del file kalkun_settings.php
            var pattern = shell.grep(/\$config\['multiple_modem'\]*/, '/home/aldo/Scrivania/kalkun_settings.php'); //Recuperiamo l'array del php contenente i numeri delle chiavette
            //Aggiungiamo il numero della nuova chiavetta all'array
            var newPattern = pattern.replace(');\n', '');
            newPattern = newPattern.concat(",'"+req.body['phoneid']+"');");
            // TODO Cambiare il path del file kalkun_settings.php
            shell.sed('-i',/^\$config\['multiple_modem'\] = array.*/,newPattern,'/home/aldo/Scrivania/kalkun_settings.php');
            if (shell.exec("echo 0000 | sudo -S touch /lib/systemd/system/gammu" + count + ".service").code !== 0) //Creiamo il file gammu*.service
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("echo 0000 | sudo -S chmod 777 /lib/systemd/system/gammu" + count + ".service").code !== 0) //Modifichiamo i permessi al nuovo file
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            if (shell.exec("cat templates/template-gammu-service >> /lib/systemd/system/gammu" + count + ".service").code !== 0) //Copiamo il template nel nuovo file
                return res.send({"status": 500, "message": "Errore nell'aggiunta del device"});
            shell.sed('-i',/Gammu/, 'Gammu ' + count,'/lib/systemd/system/gammu' + count + '.service'); //modifichiamo il commento Gammu nel nuovo file
            shell.sed('-i',/smsd-/, 'smsd-' + count,'/lib/systemd/system/gammu' + count + '.service'); //Modifichiamo i campi smsd- del nuovo file
            shell.sed('-i',/smsdrc-/,'smsdrc-' + count, '/lib/systemd/system/gammu' + count + '.service'); //Modifichiamo i campi smsdrc- del nuovo file
            res.send({"status": 200, "message": "Il device &egrave; stato aggiunto correttamente"}); //Inviamo la risposta
        }
    });
});

module.exports = router;