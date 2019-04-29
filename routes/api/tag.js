const express = require('express'),
  router = express.Router(),
  debug = require('debug')('tag'),
  bunyan = require('bunyan'),
  path = require('path');

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
      `SELECT username, filePath, photoID FROM Tag NATURAL JOIN Photo WHERE username=? AND acceptedTag=0`,
      username
    );
    const clean = result.map(i => {
      return {
        username: i.username,
        photoID: i.photoID,
        filePath: path.join('uploads', 'post', i.filePath)
      };
    });
    res.status(200).json({ success: true, result: clean });
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
// accept a tag request
router.post('/accept/:id', async (req, res, next) => {
  const { photoID } = req.body;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `UPDATE Tag
      SET acceptedTag=1
      WHERE photoID=? AND username=?
      `,
      [photoID, username]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      log.info({ result: result });
      throw new Error('Does not find row');
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// delete a tag request
router.delete('/reject/:id', async (req, res, next) => {
  const { photoID } = req.body;
  const id = req.params.id;
  try {
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `DELETE FROM Tag 
      WHERE username=? AND photoID=? AND acceptedTag=0
      `,
      [username, photoID]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      log.info({ result: result });
      throw new Error('does not find row');
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
module.exports = router;
