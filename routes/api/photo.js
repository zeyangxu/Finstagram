const express = require('express'),
  router = express.Router(),
  debug = require('debug')('photo'),
  bunyan = require('bunyan'),
  path = require('path');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');
const log = bunyan.createLogger({ name: 'photo' });

// get your main page photo
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    log.info({ route: '@get/:id', id });
    // validate the session
    const username = await findUser(id, res, next);
    const result = await conn.query(
      `SELECT p.photoID, p.photoOwner, p.timestamp, p.filePath, p.caption, p.allFollowers, s.groupName, s.groupOwner
      FROM Photo p LEFT OUTER JOIN Share s ON (p.photoID=s.photoID)
      WHERE p.allFollowers=1 
      AND p.photoOwner IN
      (SELECT followeeUsername FROM Follow 
        WHERE followerUsername=? AND acceptedfollow=1) 
        OR p.photoID IN 
      (SELECT photoID FROM Photo WHERE photoOwner=?)
      OR p.photoID IN
      (SELECT photoID FROM Share NATURAL JOIN Belong b
       WHERE b.username=?)
       OR p.photoID IN
       (SELECT photoID FROM Share s WHERE s.groupOwner=?)`,
      [username, username, username, username]
    );

    const pathList = result
      .map(i => {
        return {
          username: i.photoOwner,
          filePath: path.join('uploads', 'post', i.filePath),
          photoID: i.photoID,
          timestamp: i.timestamp,
          caption: i.caption,
          isPublic: i.allFollowers,
          groupName: i.groupName
        };
      })
      .reverse();
    res.status(200).json({ success: true, data: pathList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

// get other user's gallery photo
router.get('/user/:username', async (req, res, next) => {
  const username = req.params.username;
  log.info({ router: '@get /user/:username' });
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
          filePath: path.join('uploads', 'post', i.filePath),
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
