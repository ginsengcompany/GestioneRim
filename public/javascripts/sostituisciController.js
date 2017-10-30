var sostituisciImei = function () {
    var oldImei = document.getElementById('selectImei').value;
    var newImei = document.getElementById('inputNewImei').value;
    if (/15{[0-9]}/.test(newImei))
        alert("Bravo");
};

