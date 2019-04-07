const express = require('express'),
  router = express.Router(),
  debug = require('debug')('gallery'),
  bunyan = require('bunyan'),
  fs = require('fs'),
  util = require('util');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

const log = bunyan.createLogger({ name: 'gallery' });
const unlink = util.promisify(fs.unlink);

router.get('/:id', async (req, res, next) => {
  try {
    const username = await findUser(req.params.id, res);
    const result = await conn.query(
      `SELECT filePath, photoID, timestamp, caption, allFollowers FROM Photo WHERE photoOwner='${username}'`
    );
    const pathList = result
      .map(i => {
        return {
          username: username,
          filePath: i.filePath.replace(/public/, ''),
          photoID: i.photoID,
          timestamp: i.timestamp,
          caption: i.caption,
          isPublic: i.allFollowers
        };
      })
      .reverse();
    log.info({ func: 'gallery get' });
    res.status(200).json({ success: true, data: pathList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const photoID = req.query.photo;
    const sessionID = req.query.session;
    log.info({ photoID, sessionID });
    const username = await findUser(sessionID, res);
    const filePath = await conn.query(
      `SELECT filePath FROM Photo WHERE photoID=?`,
      [photoID]
    )[0].filePath;
    const result1 = await conn.query(
      `DELETE FROM Share WHERE photoID ='${photoID}'`
    );
    if (result1.affectedRows === 1) {
      const result2 = await conn.query(
        `DELETE FROM Photo WHERE photoID=? AND photoOwner=?`,
        [photoID, username]
      );
      if (result2.affectedRows === 1) {
        await unlink(`./${filePath}`);
      }
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

module.exports = router;
