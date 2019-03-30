const express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  debug = require('debug'),
  conn = require('./conn'),
  bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'auth' });

const bcrypt_debug = debug('bcrypt'),
  mysql_debug = debug('mysql');

// @Login endpoint
// request type
// :username String
// :password String
router.post('/', (req, res) => {
  const { username, password } = req.body;
  log.info({ username: username });
  log.info({ password: password });
  conn.query(
    `SELECT password FROM Person WHERE username='${username}'`,
    (err, result) => {
      if (err) mysql_debug(err);
      log.info({ result: result });
      if (result[0]) {
        // authenticate password
        bcrypt.compare(password, result[0].password, (err, pass) => {
          if (err) {
            bcrypt_debug(err);
          }
          if (pass) {
            res.status(201).json({ success: true });
          } else {
            res.status(401).json({ success: false, error: 'WRONG_PASS' });
          }
        });
      } else {
        res.status(401).json({ success: false, error: 'NO_USER' });
      }
    }
  );
});

module.exports = router;
