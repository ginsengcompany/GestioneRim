var aggiungiPhoneId = function () {
    var phoneId = document.getElementById('inputPhoneId').value;
    if (phoneId && phoneId.trim()){
        $.post("http://localhost:3000/aggiungi",{'phoneid': phoneId}, function (response) {
            if (response.status === 200){
                document.getElementById('alertAggiungi').innerHTML = response.message;
                document.getElementById('alertAggiungi').style.display = 'block';
                document.getElementById('alertAggiungi').className = "alert alert-success";
            }
            else {
                document.getElementById('alertAggiungi').innerHTML = response.message;
                document.getElementById('alertAggiungi').style.display = 'block';
                document.getElementById('alertAggiungi').className = "alert alert-danger";
            }
        });
    }
};