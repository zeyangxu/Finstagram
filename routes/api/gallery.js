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
    let filePath, isPublic;
    // get photo file path
    const pathResult = await conn.query(
      `SELECT filePath, allFollowers FROM Photo WHERE photoID=?`,
      [photoID]
    );
    if (pathResult[0]) {
      filePath = pathResult[0].filePath;
      isPublic = pathResult[0].allFollowers == 1 ? true : false;
    } else {
      throw new Error('photoID not found');
    }
    // if the photo is public, first delete the row in Share table
    // if (isPublic) {
    //   log.info('isPublic');
    //   const result1 = await conn.query(
    //     `DELETE FROM Share WHERE photoID ='${photoID}'`
    //   );
    //   if (result1.affectedRows === 1) {
    //     log.info('delete photo in share table success');
    //   } else {
    //     throw new Error('delete multiple rows');
    //   }
    // }
    // delete
    const result = await conn.query(
      `DELETE FROM Photo WHERE photoID=? AND photoOwner=?`,
      [photoID, username]
    );
    if (result.affectedRows === 1) {
      await unlink(`./${filePath}`);
      res.status(200).json({ success: true });
    } else {
      throw new Error('delete multiple rows');
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

module.exports = router;
