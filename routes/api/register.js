const debug = require('debug'),
  express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  bunyan = require('bunyan');

// bcrypt round number
const saltRounds = 10;

// debug
const bcrypt_debug = debug('bcrypt'),
  mysql_debug = debug('mysql');

const log = bunyan.createLogger({ name: 'register' });

// mysql connection
const conn = require('./conn');

// @Register endpoint
// request type
// :username String
// :password String
// :fname String
// :lname String
router.post('/', (req, res, next) => {
  const { password, username, fname, lname } = req.body;
  // encrypt received password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      bcrypt_debug(err);
      res.status(500).json({ success: false, reason: 'hash failed' });
      next(err);
    }
    const query = `INSERT INTO Person (username, password, fname, lname) VALUES ('${username}', '${hash}', '${fname}', '${lname}')`;
    log.info({ query: query });

    conn.query(query, err => {
      if (err) {
        mysql_debug(err);
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ success: false, error: err.code });
        } else {
          res.status(400).json({ success: false, error: 'database error' });
        }
        next(err);
      } else {
        res.status(201).json(req.body);
      }
    });
  });
});

module.exports = router;
