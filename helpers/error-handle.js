const {
  TagUserVisibilityError,
  InvalidSessionError
} = require('../helpers/errors');

module.exports = (err, res, debug, log, next) => {
  debug(err);
  // TODO implement custom error for database error
  if (err.code === 'ER_DUP_ENTRY') {
    log.info('Bad Request: duplicate username');
    res.status(400).json({ success: false, error: err.code });
  } else if (err instanceof InvalidSessionError) {
    log.info(err);
    res.status(401).json({ succes: false, error: 'invalid session' });
  } else if (err instanceof TagUserVisibilityError) {
    log.info(err);
    res.status(500).json({
      success: false,
      error: `user ${err.username} cannot view this photo`
    });
  } else {
    next(err);
    res.status(500).json({ success: false, error: 'server error' });
  }
};
