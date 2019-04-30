const conn = require('./conn'),
  log = require('bunyan').createLogger({ name: 'check-visibility' }),
  debug = require('debug')('check-visibility'),
  { TagUserVisibilityError } = require('../helpers/errors');

module.exports = async (targets, photoID, username, isPublic) => {
  if (!isPublic) {
    log.info('non public');
    try {
      const result = await conn.query(
        `SELECT username FROM Belong NATURAL JOIN Share WHERE photoID=?`,
        [photoID]
      );
      const member_set = new Set(result.map(i => i.username));
      for (i of targets) {
        if (!member_set.has(i)) {
          log.info({ msg: 'find a excluded user' });
          throw new TagUserVisibilityError(i);
        }
      }
    } catch (err) {
      debug(err);
      throw err;
    }
  } else {
    log.info('public');
    try {
      const result = await conn.query(
        `SELECT followerUsername FROM Follow WHERE followeeUsername=? 
        AND acceptedfollow=1`,
        [username]
      );
      const member_set = new Set(result.map(i => i.followerUsername));
      for (i of targets) {
        if (!member_set.has(i)) {
          log.info({ msg: 'find a excluded user' });
          throw new TagUserVisibilityError(i);
        }
      }
    } catch (err) {
      debug(err);
      throw err;
    }
  }
};
