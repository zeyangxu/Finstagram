const express = require('express'),
  router = express.Router(),
  debug = require('debug')('follow'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

// logger
const log = bunyan.createLogger({ name: 'follow' });

// @Get all accepted following username
router.get('/following/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT followeeUsername FROM Follow WHERE followerUsername=? AND acceptedfollow=1`,
      username
    );
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// @Get all accepted followers username
router.get('/follower/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT followerUsername FROM Follow WHERE followeeUsername=? AND acceptedfollow=1`,
      username
    );
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// @get all follow request
router.get('/request/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT followerUsername FROM Follow WHERE followeeUsername=? AND acceptedfollow=0`,
      username
    );
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

module.exports = router;
