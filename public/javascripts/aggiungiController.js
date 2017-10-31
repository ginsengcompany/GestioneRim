var aggiungiPhoneId = function () {
    var phoneId = document.getElementById('inputPhoneId').value;
    if (phoneId && phoneId.trim()){
        $.post("http://localhost:3000/aggiungi",{'phoneid': phoneId}, function (response) {

        });
    }
};