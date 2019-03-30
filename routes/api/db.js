const express = require('express'),
  router = express.Router(),
  debug = require('debug')('mysql'),
  bunyan = require('bunyan');

const conn = require('./conn');
const log = bunyan.createLogger({ name: 'db' });

router.get('/', (req, res) => {
  conn.query(`SELECT * FROM Person`, (err, result) => {
    if (err) debug(err);
    log.info({ conn_result: result[0].username });
    res.send(result);
  });
});

module.exports = router;
