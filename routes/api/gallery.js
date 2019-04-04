const express = require('express'),
  router = express.Router(),
  debug = require('debug')('gallery'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user');
const log = bunyan.createLogger({ name: 'gallery' });

router.get('/', (req, res, next) => {
  try {
    log.info({ query: req.query.id });
    findUser(req.query.id, res, (username, res) => {
      conn.query(
        `SELECT filePath, photoID, timestamp, caption FROM Photo WHERE photoOwner='${username}'`,
        (err, result) => {
          if (err) {
            throw err;
          }
          const pathList = result
            .map(i => {
              return {
                username: username,
                filePath: i.filePath.replace(/public/, ''),
                photoID: i.photoID,
                timestamp: i.timestamp,
                caption: i.caption
              };
            })
            .reverse();
          log.info({ func: 'gallery get' });
          res.status(200).json({ success: true, data: pathList });
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  const photoID = req.params.id;
  conn.query(
    `DELETE FROM Photo WHERE photoID = '${photoID}'`,
    (err, result) => {
      if (err) {
        mysql_debug(err);
        res.status(500).json({ success: false, error: 'server error' });
        return next(err);
      } else {
        res.status(200).json({ success: true });
      }
    }
  );
});

module.exports = router;
