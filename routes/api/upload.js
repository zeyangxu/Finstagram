const express = require('express'),
  router = express.Router(),
  debug = require('debug')('upload'),
  bunyan = require('bunyan'),
  multer = require('multer'),
  uuid = require('uuid/v4'),
  path = require('path');

const errHandler = require('../../helpers/error-handle'),
  findUser = require('../../helpers/find-user'),
  conn = require('../../helpers/conn');

const log = bunyan.createLogger({ name: 'upload' });

// multer storage engine
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, './public/uploads/post');
  },
  filename: async (req, file, cb) => {
    const id = uuid();
    cb(null, `${id}${path.extname(file.originalname)}`);
  }
});

// multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  // verify image format
  fileFilter: (req, file, cb) => {
    const ext = /jpg|png|jpeg/;
    const test1 = ext.test(path.extname(file.originalname));
    const test2 = ext.test(file.mimetype);
    log.info({
      func: 'extension verify',
      test1,
      test2,
      original: path.extname(file.originalname),
      mime: file.mimetype
    });
    if (test1 && test2) {
      cb(null, true);
    } else {
      cb(new Error('Image Only!'));
    }
  }
}).single('userpost');

router.post('/photo', (req, res, next) => {
  upload(req, res, async err => {
    if (err) {
      debug(err);
      log.info({ func: 'router post', error: 'request error' });
      res
        .status(400)
        .json({ success: false, error: 'bad file upload request' });
      next(err);
    } else if (!req.file) {
      res.status(400).json({ success: false, error: 'empty submission' });
    } else {
      try {
        const username = await findUser(req.body.active_session_id, res);
        log.info({
          func: 'finduser callback',
          file_extension: path.extname(req.file.originalname),
          sessionID: req.body.active_session_id,
          description: req.body.description,
          ownerList: req.body.groupOwnerList,
          isPublic: {
            value: req.body.isPublic,
            type: typeof parseInt(req.body.isPublic)
          },
          username: username,
          file: req.file
        });
        const result = await conn.query(
          `INSERT INTO Photo (photoID, photoOwner, filePath, caption, allFollowers) VALUES (NULL, ?, ?, ?, ?)`,
          [
            username,
            req.file.path,
            req.body.description,
            parseInt(req.body.isPublic)
          ]
        );

        log.info({
          func: 'insert photo query',
          insertId: result.insertId
        });
        if (req.body.isPublic === '1') {
          const result2 = await conn.query(
            `INSERT INTO Share (groupName, groupOwner, photoID) VALUES (?, ?, ?)`,
            [req.body.groupName, req.body.groupOwner, result.insertId]
          );

          log.info({ func: 'insert photo share' });
        }
        res.status(200).json({ success: true });
      } catch (err) {
        errHandler(err, res, debug, log, next);
      }
    }
  });
});
module.exports = router;
