const express = require('express'),
  router = express.Router(),
  debug = require('debug')('mysql'),
  bunyan = require('bunyan');

const conn = require('./conn');
const log = bunyan.createLogger({ name: 'db' });

router.get('/test', (req, res) => {
  log.info({ cookie: req.session.cookie });
  res.status(201).json({ username: req.session.username });
});

module.exports = router;
