const express = require('express'),
  router = express.Router(),
  debug = require('debug')('upload'),
  bunyan = require('bunyan'),
  multer = require('multer'),
  uuid = require('uuid/v4'),
  path = require('path'),
  fs = require('fs');

const conn = require('../../conn');
const log = bunyan.createLogger({ name: 'upload' });

// multer storage engine
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, './uploads/post');
    // try {
    //   const username = await findUser(req.body.zebxu);
    //   log.info({
    //     func: 'destination',
    //     dest_req: req.body.zebxu,
    //     username: String(username)
    //   });
    //   if (usernmae) {
    //     const dir = `./uploads/post/${username}`;
    //     if (!fs.existsSync(dir)) {
    //       fs.mkdirSync(dir);
    //     }
    //     cb(null, dir);
    //   } else {
    //     throw new Error('username not found');
    //   }
    // } catch (err) {
    //   throw err;
    // }
  },
  filename: async (req, file, cb) => {
    const id = uuid();
    log.info({ storage_req: req.body.zebxu });
    // try {
    //   const username = await findUser(req.body.zebxu);
    //   log.info({ reture_usernmae: username });
    //   if (username) {
    //     log.info({ username_exist: true });
    //     conn.query(
    //       `INSERT INTO Photo (photoID, photoOwner) VALUES ('${id}', '${username}')`,
    //       (err, result) => {
    //         if (err) debug(err);
    //         if (result.affectedRows === 1) {
    //           log.info({ save_photoOwner: true });
    //         } else {
    //           log.info({ save_photoOwner: false });
    //         }
    //       }
    //     );
    //   } else {
    //     log.info({ usernmae_exist: false });
    //   }
    // } catch (err) {
    //   throw err;
    // }
    cb(null, `${id}${path.extname(file.originalname)}`);
  }
});

const findUser = async (sessionID, res, cb) => {
  conn.query(
    `SELECT data FROM sessions WHERE session_id='${sessionID}'`,
    (err, result) => {
      if (err) {
        debug(err);
      }
      if (result[0]) {
        const obj = JSON.parse(result[0].data);
        log.info({ func: 'findUser', upload_user: obj.username });
        cb(res, obj.username);
      } else {
        log.info('session id not found');
      }
    }
  );
};
// multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const ext = /jpg|png|jpeg/;
    const test1 = ext.test(path.extname(file.originalname));
    const test2 = ext.test(file.mimetype);
    log.info({
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
      log.info('request error');
      res.status(400).json({ success: false, error: String(err) });
      next(err);
    } else if (!req.file) {
      res.status(400).json({ success: false, error: 'empty submission' });
    } else {
      findUser(req.body.active_session_id, res, (res, username) => {
        log.info({
          file_extension: path.extname(req.file.originalname),
          sessionID: req.body.active_session_id,
          username: username,
          file: req.file
        });
        conn.query(
          `INSERT INTO Photo (photoID, photoOwner, filePath) VALUES (NULL, '${username}', '${
            req.file.path
          }')`,
          (err, result) => {
            if (err) {
              throw err;
            }
            log.info({ func: 'insert photo query', insertId: result.insertId });
          }
        );
        res.status(200).json({ success: true });
      });
    }
  });
});

module.exports = router;
