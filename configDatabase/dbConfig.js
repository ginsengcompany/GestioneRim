var express = require('express');
var mysql = require('mysql');


function getMySQLConnection() {
    return mysql.createConnection({
        host     : '192.168.125.12',
        user     : 'root',
        password : '',
        database : 'kalkun',
        multipleStatements: true
    });
}
module.exports.getMySQLConnection = getMySQLConnection;