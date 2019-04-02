const express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  debug = require('debug'),
  conn = require('./conn'),
  bunyan = require('bunyan');

// logger
const log = bunyan.createLogger({ name: 'auth' });

// debugger
const bcrypt_debug = debug('bcrypt'),
  mysql_debug = debug('mysql');

// @Log-out endpoint
// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  conn.query(`DELETE FROM sessions WHERE session_id='${id}'`, (err, result) => {
    if (err) {
      mysql_debug(err);
      next(err);
    }
    log.info({ function: 'sql remove session', sessionID: id, result: result });
    // const r = JSON.parse(result);
    // log.info({ sql_delete_result: r });
    if (result.affectedRows === 1) {
      res.status(201).json({ success: true });
      log.info('delete success');
    } else {
      res.status(400).json({ success: false });
    }
  });
});

// @Login check session endpoint
// get
router.get('/:id', (req, res) => {
  const id = req.params.id;
  conn.query(
    `SELECT data FROM sessions WHERE session_id='${id}'`,
    (err, result) => {
      if (err) {
        mysql_debug(err);
        next(err);
      }
      log.info({
        function: 'sql check session query',
        sessionID: id,
        result: result
      });
      if (result[0]) {
        const data = JSON.parse(result[0].data);
        console.log(data.cookie.expires);
        res.status(201).json({ success: true });
      } else {
        res.status(401).json({ success: false, msg: 'session not found' });
      }
    }
  );
});

// @Login with username and password endpoint
// post
// :username String
// :password String
router.post('/', (req, res) => {
  const { username, password } = req.body;
  log.info({
    username: username,
    password: password,
    sessionID: req.sessionID
  });
  conn.query(
    `SELECT password FROM Person WHERE username='${username}'`,
    (err, result) => {
      if (err) {
        mysql_debug(err);
        next(err);
      }
      log.info({ function: 'sql connection query', result: result });
      if (result[0]) {
        // authenticate password
        bcrypt.compare(password, result[0].password, (err, pass) => {
          if (err) {
            bcrypt_debug(err);
            next(err);
          }
          if (pass) {
            req.session.username = username;
            res.status(201).json({ success: true, session: req.session.id });
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
