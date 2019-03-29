const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'finstagram',
  port: 8889
});
conn.connect(err => {
  if (err) {
    console.error(err);
  }
  console.log('database connected!');
});

module.exports = conn;
