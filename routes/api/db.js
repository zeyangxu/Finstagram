const express = require('express'),
  router = express.Router();

const conn = require('./conn');

router.get('/', (req, res) => {
  conn.query(`SELECT * FROM Person`, (err, result) => {
    if (err) console.error(err);
    console.log(result[0].username);
    res.send(result);
  });
});

module.exports = router;
