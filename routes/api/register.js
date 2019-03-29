const express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router();

const saltRounds = 10;
const conn = require('./conn');
// @Register endpoint
// request type
// :username String
// :password String
// :fname String
// :lname String
router.post('/', (req, res) => {
  const { password, username, fname, lname } = req.body;

  // encrypt submitted password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
    }
    const query = `INSERT INTO Person (username, password, fname, lname) VALUES ('${username}', '${hash}', '${fname}', '${lname}')`;
    console.log(query);

    conn.query(query, err => {
      if (err) console.error(err);
      console.log('Sign up success!');
      res.status(201).json(req.body);
    });
  });
});

module.exports = router;
