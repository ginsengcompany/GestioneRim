var express = require('express');
var router = express.Router();
var fs = require('shelljs');

router.get('/', function (req, res) {
    res.render('aggiungi');
});

router.post('/', function (req, res) {
    /* var path = "/etc/";
     fs.readdir(path, function (err, items) {
      console.log(items);
         for (var i=0; i < items.length; i++){
             console.log(items[i]);
         }
     })*/
   var items = fs.pwd();
   console.log(items);
});

module.exports = router;