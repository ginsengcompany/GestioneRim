/**
 * Function utilizzata Per sostituire una  chiavetta
 */
var sostituisciImei = function () {
    var oldImei = document.getElementById('selectImei').value; //Recuperiamo vecchio imei scelto dalla select
    var newImei = document.getElementById('inputNewImei').value; //Recuperiamo nuovo imei scritto
    if (/.*[0-9].*/.test(newImei) && newImei.trim().length === 15){ //Controllo del campo inputNewImei
        $.post("http://localhost:3000/sostituisci",{"oldImeiBody": oldImei, "newImeiBody": newImei}, function (response) { //Risposta della post
            if(response.status === 200){ //Se la post è andata a buon fine mosta un alert verde
                document.getElementById('alertSostituzione').innerHTML = response.message;
                document.getElementById('alertSostituzione').style.display = 'block';
                document.getElementById('alertSostituzione').className = "alert alert-success";
            }
        });
    }
    else { //Errore nella post viene mostrato un alert rosso
        document.getElementById('alertSostituzione').className = "alert alert-danger";
        document.getElementById('alertSostituzione').innerHTML = "Controllare i campi inseriti";
        document.getElementById('alertSostituzione').style.display = 'block';
    }
};

