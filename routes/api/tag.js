const express = require('express'),
  router = express.Router(),
  debug = require('debug')('tag'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle'),
  checkVisibility = require('../../helpers/check-visibility');

// logger
const log = bunyan.createLogger({ name: 'tag' });

// get all tag request you recieve and not accept yet
router.get('/receive/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT photoID FROM Tag WHERE username=? AND acceptedTag=0`,
      username
    );
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
router.get('/photo/', async (req, res, next) => {
  const photoID = req.query.photoID;
  try {
    const result = await conn.query(
      `SELECT username, fname, lname, acceptedTag FROM Tag NATURAL JOIN Person WHERE photoID=?`,
      [photoID]
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// tag multiple users in a photo
router.post('/add/:id', async (req, res, next) => {
  const { users, photoID, isPublic } = req.body;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    // if the photo is not public check-visibility
    if (!isPublic) {
      await checkVisibility(users, photoID);
    }
    const nested = users.map(i => [i, photoID, i === username ? 1 : 0]);
    const result = await conn.query(
      `INSERT INTO Tag (username, photoID, acceptedTag) VALUES ?`,
      [nested]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// TODO accept a tag request
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
// TODO delete a tag request
router.delete('/reject/:id', async (req, res, next) => {
  const target = req.query.user;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `DELETE FROM Follow 
      WHERE followeeUsername=? AND followerUsername=? AND acceptedfollow=0
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
