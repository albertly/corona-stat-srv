const express = require('express');

const router = express.Router();
const { getProbByDate } = require('../services/dailyProb.service');
const { getStat } = require('../services/stat.service');
const { getDailyCasesWorldwide } = require('../services/cases.service');
const { addSubscriber, broadcastNotification } = require('../services/notification.service');
const { broadcast } = require('../utils/common');
const { restart } = require('nodemon');


router.post('/subscribe', async function(req, res, next){
  const notification = req.body;

  try {
    await addSubscriber(notification);
    res.status(201);
    return res.json('Ok');
  }
  catch(e) {
    res.send(500);
    return res.send('Error adding subscription: ' + e);
  }

});

router.get('/broadcast', async function(req, res, next){
  try {
    await broadcastNotification('');
    return res.status(200).json('Ok');
  }
  catch(e) {
    return res.status(500).send('Error broadcasting notification: ' + e);
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

  getStat(!req.params.day ? true : false).then(r => {
    res.json(r);
  })
    .catch(e => {
      console.log('e', e);
    });

});

module.exports = router;
