var express = require('express');
var mysql = require('mysql');


function getMySQLConnection() {
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mederos',
        database : 'kalkun',
    });
}
module.exports.getMySQLConnection = getMySQLConnection;