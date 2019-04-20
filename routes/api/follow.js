const express = require('express'),
  router = express.Router(),
  debug = require('debug')('follow'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

// logger
const log = bunyan.createLogger({ name: 'follow' });

// @Get all username that accepted your follow
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

// @Get all usernames that following you and you accept
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

// @get all usernames that request to follow you and not accept yet
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

// check if you follow this user
router.get('/isfollow/:id', async (req, res, next) => {
  const id = req.params.id;
  const target = req.query.user;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT acceptedfollow FROM Person AS p LEFT OUTER JOIN Follow AS f 
      ON p.username=f.followeeUsername AND 
      followerUsername=?
      WHERE p.username=?
      `,
      [username, target]
    );
    let state = '';
    switch (result[0].acceptedfollow) {
      case 1:
        state = 'Following';
        break;
      case 0:
        state = 'Requested';
        break;
      case null:
        state = 'Follow';
        break;
      default:
        state = 'Follow';
    }
    res.status(200).json({ success: true, result: state });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// make a follow request
router.post('/request/:id', async (req, res, next) => {
  const target = req.query.user;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `INSERT INTO Follow (followerUsername, followeeUsername, acceptedFollow) VALUES (?, ?, ?)
      `,
      [username, target, 0]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// accept a request
router.post('/accept/:id', async (req, res, next) => {
  const target = req.query.user;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `UPDATE Follow
      SET acceptedfollow=1
      WHERE followeeUsername=? AND followerUsername=?
      `,
      [username, target]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      throw new Error('Does not find row');
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// delete a request
router.delete('/reject/:id', async (req, res, next) => {
  const target = req.query.user;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `DELETE FROM Follow 
      WHERE followeeUsername=? AND followerUsername=?
      `,
      [username, target]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      log.info({ result: result });
      throw new Error('Database error');
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
module.exports = router;
