const express = require('express'),
  router = express.Router(),
  debug = require('debug')('search'),
  bunyan = require('bunyan'),
  multer = require('multer'),
  uuid = require('uuid/v4'),
  path = require('path'),
  request = require('request'),
  fs = require('fs');

const errHandler = require('../../helpers/error-handle'),
  findUser = require('../../helpers/find-user'),
  conn = require('../../helpers/conn');

const log = bunyan.createLogger({ name: 'search' });

// @get search user result by giving keyword search query
router.get('/user/', async (req, res, next) => {
  const keyword = req.query.keyword;
  try {
    const result = await conn.query(
      `SELECT username FROM Person WHERE username LIKE '%${keyword}%'`
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// @get all user result
router.get('/all/:id', async (req, res, next) => {
  const id = req.params.id;
  const keyword = req.query.keyword;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT
    Person.username, Follow.acceptedfollow, Person.fname, Person.lname
    FROM 
    Person LEFT OUTER JOIN Follow 
    ON Person.username = Follow.followeeUsername 
    AND Follow.followerUsername=?
    WHERE Person.username!=? AND Person.username LIKE '%${keyword}%'`,
      [username, username]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
module.exports = router;
