const express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  debug = require('debug')('auth'),
  bunyan = require('bunyan'),
  util = require('util');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

// logger
const log = bunyan.createLogger({ name: 'auth' });

const compare = util.promisify(bcrypt.compare);

// @Log-out endpoint
// delete
router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await conn.query(
      `DELETE FROM sessions WHERE session_id='${id}'`
    );
    log.info({ function: 'sql remove session', sessionID: id, result: result });
    if (result.affectedRows === 1) {
      res.status(201).json({ success: true });
      log.info('delete success');
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// @Login check session endpoint
// get
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  log.info({ route: '@get', id });
  try {
    const username = await findUser(id, res, next);
    res.status(201).json({ success: true, username: username });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// @Login with username and password endpoint
// post
// :username String
// :password String
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  log.info({
    route: 'auth post',
    username: username,
    password: password,
    sessionID: req.sessionID
  });
  try {
    const result = await conn.query(
      `SELECT password FROM Person WHERE username='${username}'`
    );
    log.info({ function: 'sql connection query' });
    if (result[0]) {
      // authenticate password
      const pass = await compare(password, result[0].password);
      if (pass) {
        req.session.username = username;
        res
          .status(201)
          .json({ success: true, session: req.session.id })
          .end();
      } else {
        res
          .status(401)
          .json({ success: false, error: 'WRONG_PASS' })
          .end();
      }
    } else {
      res
        .status(401)
        .json({ success: false, error: 'NO_USER' })
        .end();
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

module.exports = router;
