const mysql = require('mysql'),
  debug = require('debug')('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'finstagram',
  port: 8889
});
conn.connect(err => {
  if (err) {
    debug(err);
  }
  debug('database connected!');
});

module.exports = conn;
