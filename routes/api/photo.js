const express = require('express'),
  router = express.Router(),
  debug = require('debug')('photo'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user');
const log = bunyan.createLogger({ name: 'photo' });

router.get('/:id', (req, res, next) => {
  try {
    log.info({ query: req.params.id });
    findUser(req.params.id, res, (username, res) => {
      conn.query(
        `SELECT photoOwner, filePath, photoID, timestamp, caption, allFollowers FROM Photo WHERE allFollowers=1`,
        (err, result) => {
          if (err) {
            throw err;
          }
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
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
