const mysql = require('mysql');
const connection = mysql.createConnection({
    /*removed*/
});

connection.connect();

connection.query(`SELECT * FROM pw_user WHERE user_name="Apx" AND user_token="5c0f6f90ab7d5c5133b1ae0b0aeeafd0"`, function(error, results, fields) {
    if (error) throw error;

    if (results.length !== 1) return;

    console.log(results);
});

connection.end();