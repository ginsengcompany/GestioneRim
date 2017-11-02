// Richiama la funzione getLog quando la pagina è in stato di ready
$(document).ready(function () {
    getLog();
});

/**
 * Function utilizzata per recuperare informazioni dal file di log
 */
function getLog() {
        $.get("http://localhost:3000/log",function(result) {
            document.getElementById("responseLog").innerHTML = result;
            setTimeout(getLog,60000);
        });
}