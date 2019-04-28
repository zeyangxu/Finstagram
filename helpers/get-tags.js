const conn = require('./conn'),
  log = require('bunyan').createLogger({ name: 'get-tags' }),
  debug = require('debug')('get-tags'),

module.exports = async (photoID) => {
  try {
    const result = await conn.query(
      `SELECT username FROM Tag WHERE photoID=?`,
      [photoID]
    );
    return result;
  } catch (err) {
    debug(err);
    throw err;
  }
};
