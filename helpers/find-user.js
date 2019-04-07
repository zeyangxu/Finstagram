const conn = require('./conn'),
  log = require('bunyan').createLogger({ name: 'find-user' }),
  debug = require('debug')('find-user');

module.exports = async (sessionID, res, next) => {
  log.info('findUser start');
  try {
    const result = await conn.query(
      `SELECT data FROM sessions WHERE session_id='${sessionID}'`
    );
    if (result[0]) {
      const obj = JSON.parse(result[0].data);
      log.info({ func: 'findUser', upload_user: obj.username });
      return obj.username;
    } else {
      throw new Error('session id not found');
    }
  } catch (err) {
    debug(err);
    throw err;
  }
};
