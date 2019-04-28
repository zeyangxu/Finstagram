const conn = require('./conn'),
  log = require('bunyan').createLogger({ name: 'find-user' }),
  debug = require('debug')('find-user'),
  { InvalidSessionError } = require('../helpers/errors');

module.exports = async (sessionID, res, next) => {
  try {
    const result = await conn.query(
      `SELECT data FROM sessions WHERE session_id='${sessionID}'`
    );
    if (result[0]) {
      const obj = JSON.parse(result[0].data);
      // log.info({ upload_user: obj.username });
      return obj.username;
    } else {
      throw new InvalidSessionError(sessionID);
    }
  } catch (err) {
    debug(err);
    throw err;
  }
};
