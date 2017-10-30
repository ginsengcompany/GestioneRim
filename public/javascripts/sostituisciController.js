var sostituisciImei = function () {
    var oldImei = document.getElementById('selectImei').value;
    var newImei = document.getElementById('inputNewImei').value;
    if (/.*[0-9].*/.test(newImei) && newImei.trim().length === 15){
        $.post("http://localhost:3000/sostituisci",{"oldImeiBody": oldImei, "newImeiBody": newImei}, function (response) {
            if(response.status === 200){
                document.getElementById('alertSostituzione').innerHTML = response.message;
                document.getElementById('alertSostituzione').style.display = 'block';
                document.getElementById('alertSostituzione').className = "alert alert-success";
            }
        });
    }
    else {
        document.getElementById('alertSostituzione').className = "alert alert-danger";
        document.getElementById('alertSostituzione').innerHTML = "Controllare i campi inseriti";
    }
};

