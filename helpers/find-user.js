const conn = require('./conn'),
  log = require('bunyan').createLogger({ name: 'find-user' });

// recieve session id and pass res, username to callback
// throw error is no username is found
module.exports = async (sessionID, res, cb) => {
  conn.query(
    `SELECT data FROM sessions WHERE session_id='${sessionID}'`,
    (err, result) => {
      if (err) {
        debug(err);
      }
      if (result[0]) {
        const obj = JSON.parse(result[0].data);
        log.info({ func: 'findUser', upload_user: obj.username });
        cb(obj.username, res);
      } else {
        res.status(400).json({ succes: false, error: 'session id not found' });
        log.info('session id not found');
      }
    }
  );
};
