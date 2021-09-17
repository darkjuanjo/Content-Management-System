const mysql = require('mysql2');

//Connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        //Your MYSQL username,
        user: 'root',
        // Your MYSQL password
        password: '123456',
        database: 'management'
    }
);
module.exports = connection;