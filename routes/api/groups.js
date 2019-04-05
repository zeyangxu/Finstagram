const express = require('express'),
  router = express.Router(),
  debug = require('debug')('groups'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user');
const log = bunyan.createLogger({ name: 'groups' });

router.get('/own/:id', (req, res, next) => {
  try {
    log.info({ request_session_id: req.params.id });
    findUser(req.params.id, res, (username, res) => {
      conn.query(
        `SELECT groupName, groupOwner FROM CloseFriendGroup WHERE groupOwner=?`,
        [username],
        (err, result) => {
          if (err) {
            throw err;
          }
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
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

router.get('/belong/:id', (req, res, next) => {
  try {
    log.info({ request_session_id: req.params.id });
    findUser(req.params.id, res, (username, res) => {
      conn.query(
        `SELECT groupName, groupOwner FROM Belong WHERE username=?`,
        [username],
        (err, result) => {
          if (err) {
            throw err;
          }
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
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
