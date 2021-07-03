const mysql = require('mysql');
const Promise = require('bluebird');
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
const conn = Promise.promisifyAll(connection);

module.exports = conn;
