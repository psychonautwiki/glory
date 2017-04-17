const mysql = require('mysql');
const connection = mysql.createConnection({
    /*removed*/
});

connection.connect();

connection.query(`SELECT * FROM pw_user WHERE user_name="XXX" AND user_token="XXX"`, function(error, results, fields) {
    if (error) throw error;

    if (results.length !== 1) return;

    console.log(results);
});

connection.end();