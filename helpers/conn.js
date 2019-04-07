const mysql = require('mysql'),
  debug = require('debug')('mysql'),
  log = require('bunyan').createLogger({ name: 'conn' }),
  util = require('util');

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
    next(err);
  }
  log.info('database connected!');
});
conn.query = util.promisify(conn.query);
module.exports = conn;
