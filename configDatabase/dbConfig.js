var express = require('express');
var mysql = require('mysql');


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