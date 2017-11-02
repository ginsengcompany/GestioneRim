var express = require('express');
var mysql = require('mysql');

//Function utilizzata per creare la connessione al database
function getMySQLConnection() {
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mederos',
        database : 'kalkun',
        multipleStatements: true
    });
}
module.exports.getMySQLConnection = getMySQLConnection;