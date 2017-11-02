/**
 * Function utilizzata Per aggiungere una nuova chiavetta
 */
var aggiungiPhoneId = function () {
    var phoneId = document.getElementById('inputPhoneId').value;//recuperiamo il numero della chiavetta da aggiungere
    if (phoneId && phoneId.trim()){//Controlliamo che il numero sia pressochè corretto sintatticamente
        $.post("http://localhost:3000/aggiungi",{'phoneid': phoneId}, function (response) { //Richiesta POST alla rotta aggiungi
            if (response.status === 200){ //L'aggiungta è andata a buon fine
                document.getElementById('alertAggiungi').innerHTML = response.message;
                document.getElementById('alertAggiungi').style.display = 'block';
                document.getElementById('alertAggiungi').className = "alert alert-success";
            }
            else { //Errore durante l'aggiunta della chiavetta
                document.getElementById('alertAggiungi').innerHTML = response.message;
                document.getElementById('alertAggiungi').style.display = 'block';
                document.getElementById('alertAggiungi').className = "alert alert-danger";
            }
        });
    }
};