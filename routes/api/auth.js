const express = require('express'),
  bcrypt = require('bcrypt'),
  router = express.Router(),
  conn = require('./conn');

// @Login endpoint
// request type
// :username String
// :password String
router.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log('username: ' + username);
  console.log('password: ' + password);
  conn.query(
    `SELECT password FROM Person WHERE username='${username}'`,
    (err, result) => {
      if (err) console.error(err);
      console.log(result);
      if (result[0]) {
        // authenticate password
        bcrypt.compare(password, result[0].password, (err, pass) => {
          if (err) {
            console.error(err);
          }
          if (pass) {
            res.send('password is correct');
          } else {
            res.send('incorrect password');
          }
        });
      } else {
        res.send("username doesn't exist");
      }
    }
  );
});

module.exports = router;
