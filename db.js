const mysql = require('mysql');

const con = mysql.createConnection({
    host: "remotemysql.com",
    user: "7mG4WIo1Oa",
    password: "OGhBW0HWc7",
    database: "7mG4WIo1Oa"
});
   
con.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

module.export = con;