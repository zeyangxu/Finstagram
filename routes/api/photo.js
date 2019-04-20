const express = require('express'),
  router = express.Router(),
  debug = require('debug')('photo'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');
const log = bunyan.createLogger({ name: 'photo' });

// get your main page photo
router.get('/:id', async (req, res, next) => {
  try {
    // validate the session
    await findUser(req.params.id, res, next);
    const result = await conn.query(
      `SELECT photoOwner, filePath, photoID, timestamp, caption, allFollowers FROM Photo WHERE allFollowers=1`
    );

    const pathList = result
      .map(i => {
        return {
          username: i.photoOwner,
          filePath: i.filePath.replace(/public/, ''),
          photoID: i.photoID,
          timestamp: i.timestamp,
          caption: i.caption,
          isPublic: i.allFollowers
        };
      })
      .reverse();
    log.info({ func: 'photo get' });
    res.status(200).json({ success: true, data: pathList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// get other user's gallery photo
router.get('/user/:username', async (req, res, next) => {
  const username = req.params.username;
  try {
    // validate the session
    const result = await conn.query(
      `SELECT filePath, photoID, timestamp, caption, allFollowers FROM Photo WHERE allFollowers=1 AND photoOwner=?`,
      [username]
    );

    const pathList = result
      .map(i => {
        return {
          username: i.photoOwner,
          filePath: i.filePath.replace(/public/, ''),
          photoID: i.photoID,
          timestamp: i.timestamp,
          caption: i.caption,
          isPublic: i.allFollowers
        };
      })
      .reverse();
    log.info({ func: 'photo other user get' });
    res.status(200).json({ success: true, data: pathList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
module.exports = router;
