module.exports = (err, res, debug, log, next) => {
  debug(err);
  if (err.code === 'ER_DUP_ENTRY') {
    log.info('Bad Request: duplicate username');
    res.status(403).json({ success: false, error: err.code });
  } else if (err.message === 'session id not found') {
    log.info(err);
    res.status(400).json({ succes: false, error: 'session id not found' });
  } else {
    next(err);
    res.status(500).json({ success: false, error: 'server error' });
  }
};
