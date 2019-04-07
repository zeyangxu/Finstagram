const debug = require('debug')('register'),
  express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  bunyan = require('bunyan'),
  util = require('util');

// bcrypt round number
const saltRounds = 10;

const log = bunyan.createLogger({ name: 'register' });
const hash = util.promisify(bcrypt.hash);

// mysql connection
const conn = require('../../helpers/conn'),
  errHandle = require('../../helpers/error-handle');

// @Register endpoint
// request type
// :username String
// :password String
// :fname String
// :lname String
router.post('/', async (req, res, next) => {
  const { password, username, fname, lname } = req.body;
  log.info({ cookie: req.session.cookie, id: req.session.id });
  try {
    // encrypt received password

    const hashed = await hash(password, saltRounds);
    const result = await conn.query(
      `INSERT INTO Person (username, password, fname, lname) VALUES (?, ?, ?, ?)`,
      [username, hashed, fname, lname]
    );
    if (result.affectedRows === 1) {
      req.session.username = username;
      res.status(201).json({ success: true, sessionID: req.session.id });
    } else {
      res.status(400).json({ success: false, error: 'invalid input' });
    }
  } catch (err) {
    errHandle(err, res, debug, log, next);
  }
});

module.exports = router;
