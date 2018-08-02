const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'example'
});

connection.connect();
connection.query('SELECT * from test_stu', function (error, results, fields) {
    if (error) throw error;
    console.dir(results);
});