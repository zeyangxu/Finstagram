const express = require('express'),
  router = express.Router(),
  debug = require('debug')('gallery'),
  bunyan = require('bunyan'),
  fs = require('fs');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user');
const log = bunyan.createLogger({ name: 'gallery' });

router.get('/:id', (req, res, next) => {
  try {
    log.info({ query: req.params.id });
    findUser(req.params.id, res, (username, res) => {
      conn.query(
        `SELECT filePath, photoID, timestamp, caption, allFollowers FROM Photo WHERE photoOwner='${username}'`,
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
                caption: i.caption,
                isPublic: i.allFollowers
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

router.delete('/', (req, res, next) => {
  const photoID = req.query.photo;
  const sessionID = req.query.session;
  log.info({ photoID, sessionID });
  findUser(sessionID, res, (username, res) => {
    conn.query(
      `SELECT filePath FROM Photo WHERE photoID=?`,
      [photoID],
      (err, result) => {
        if (err) {
          debug(err);
          res.status(500).json({ success: false, error: 'server error' });
          return next(err);
        } else {
          const path = result[0].filePath;
          // log.info(result[0].filePath);

          conn.query(
            `DELETE FROM Share WHERE photoID ='${photoID}'`,
            (err, result) => {
              if (err) {
                debug(err);
                res.status(500).json({ success: false, error: 'server error' });
                return next(err);
              } else {
                conn.query(
                  `DELETE FROM Photo WHERE photoID=? AND photoOwner=?`,
                  [photoID, username],
                  (err, result) => {
                    if (err) {
                      debug(err);
                      res
                        .status(500)
                        .json({ success: false, error: 'server error' });
                      return next(err);
                    }
                    if (result.affectedRows === 1) {
                      fs.unlink(`./${path}`, err => {
                        if (err) {
                          debug(err);
                          res
                            .status(500)
                            .json({ success: false, error: 'server error' });
                          return next(err);
                        } else {
                          res.status(200).json({ success: true });
                        }
                      });
                    } else {
                      res.status(400).json({
                        success: false,
                        error: 'not found photo or user'
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
  // conn.query(
  //   `DELETE FROM Photo WHERE photoID = '${photoID}'`,
  //   (err, result) => {
  //     if (err) {
  //       mysql_debug(err);
  //       res.status(500).json({ success: false, error: 'server error' });
  //       return next(err);
  //     } else {
  //       res.status(200).json({ success: true });
  //     }
  //   }
  // );
});

module.exports = router;
