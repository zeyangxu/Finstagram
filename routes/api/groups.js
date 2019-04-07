const express = require('express'),
  router = express.Router(),
  debug = require('debug')('groups'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

const log = bunyan.createLogger({ name: 'groups' });

router.get('/own/:id', async (req, res, next) => {
  try {
    log.info({ request_session_id: req.params.id });
    const username = await findUser(req.params.id, res);
    const result = await conn.query(
      `SELECT groupName, groupOwner FROM CloseFriendGroup WHERE groupOwner=?`,
      [username]
    );

    const groupList = result
      .map(i => {
        return {
          groupName: i.groupName,
          groupOwner: i.groupOwner
        };
      })
      .reverse();
    log.info({ func: 'own groups get' });
    res.status(200).json({ success: true, data: groupList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

router.get('/belong/:id', async (req, res, next) => {
  try {
    log.info({ request_session_id: req.params.id });
    const username = await findUser(req.params.id, res);
    const result = await conn.query(
      `SELECT groupName, groupOwner FROM Belong WHERE username=?`,
      [username]
    );
    const groupList = result
      .map(i => {
        return {
          groupName: i.groupName,
          groupOwner: i.groupOwner
        };
      })
      .reverse();
    log.info({ func: 'own groups get' });
    res.status(200).json({ success: true, data: groupList });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});

module.exports = router;
