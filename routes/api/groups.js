const express = require('express'),
  router = express.Router(),
  debug = require('debug')('groups'),
  bunyan = require('bunyan');

const conn = require('../../helpers/conn'),
  findUser = require('../../helpers/find-user'),
  errHandler = require('../../helpers/error-handle');

const log = bunyan.createLogger({ name: 'groups' });

// get all groups you own
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
// get all groups you belong to
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
// add someone to your group
router.post('/add/:id', async (req, res, next) => {
  const { inviteUserName, groupName } = req.body;
  try {
    const ownerName = await findUser(req.params.id, res);
    const result = await conn.query(
      `INSERT INTO Belong (groupName, groupOwner, username)
      VALUES
      (?, ?, ?)`,
      [groupName, ownerName, inviteUserName]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'database error' });
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// create a new group
router.post('/create/:id', async (req, res, next) => {
  const { groupName } = req.body;
  try {
    const ownerName = await findUser(req.params.id, res);
    const result = await conn.query(
      `INSERT INTO CloseFriendGroup (groupName, groupOwner)
      VALUES
      (?, ?)`,
      [groupName, ownerName]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'database error' });
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// delete a group
router.delete('/delete/:id', async (req, res, next) => {
  const { groupName } = req.body;
  try {
    const ownerName = await findUser(req.params.id, res);
    const result = await conn.query(
      `DELETE FROM CloseFriendGroup WHERE groupName=? AND groupOwner=?`,
      [groupName, ownerName]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'database error' });
    }
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
// get all usernames in your group
router.get('/users/:id', async (req, res, next) => {
  const groupName = req.query.groupName;
  try {
    const username = await findUser(req.params.id, res);
    const result = await conn.query(
      `SELECT username FROM Belong 
      WHERE groupOwner=? AND groupName=?`,
      [username, groupName]
    );
    const clean = result.map(i => i.username);
    log.info({ func: 'groups usernames get' });
    res.status(200).json({ success: true, data: clean });
  } catch (err) {
    errHandler(err, res, debug, log, next);
  }
});
module.exports = router;
