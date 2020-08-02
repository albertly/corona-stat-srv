const express = require('express');
const router = express.Router();

const { getProbByDate } = require('../services/dailyProb.service');
const { getStat } = require('../services/stat.service');
const { getDailyCasesWorldwide } = require('../services/cases.service');
const {
  addSubscriber,
  broadcastNotification,
} = require('../services/notification.service');
const { broadcast } = require('../utils/common');
const { restart } = require('nodemon');
const authMiddleware = require('../utils/auth');

router.get('/testAuth', authMiddleware, function (req, res, next) {
  console.log('/testAuth');
  res.json('Ok. Auth');
});

router.post('/subscribe', authMiddleware, async function (req, res, next) {
  const notification = { ...req.body, uid: req.userClaims.uid };

  try {
    console.log('notification', notification);
    await addSubscriber(notification);
    res.status(201);
    return res.json('Ok');
  } catch (e) {
    res.send(e);
    return res.send('Error adding subscription: ' + e);
  }
});

router.get('/broadcast', async function (req, res, next) {
  try {
    await broadcastNotification('');
    return res.status(200).json('Ok');
  } catch (e) {
    return res
      .status(500)
      .send(
        'Error broadcasting notification: GCMAPI_KEY: ' +
          process.env.GCMAPI_KEY +
          ' Error ' +
          e
      );
  }
});

router.get('/graph/:country?', async function (req, res, next) {
  const result = await getDailyCasesWorldwide(req.params.country);
  res.json(result);
});

router.get('/prob/:probDate', async function (req, res, next) {
  const result = await getProbByDate(req.params['probDate']);
  res.json(result);
});

router.get('/:day?', function (req, res, next) {
  getStat(!req.params.day ? true : false)
    .then((r) => {
      res.json(r);
    })
    .catch((e) => {
      console.log('e', e);
    });
});

module.exports = router;
