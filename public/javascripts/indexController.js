$(document).ready(function () {
    getLog();
});

function getLog() {
        $.get("http://localhost:3000/log",function(result) {
            if(window.location.pathname === '/')
                document.getElementById("responseLog").innerHTML = result;
            setTimeout(getLog,60000);
        });
}