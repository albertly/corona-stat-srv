const express = require('express');

const router = express.Router();
const { getProbByDate } = require('../services/dailyProb.service');
const { getStat } = require('../services/stat.service');
const { getDailyCasesWorldwide } = require('../services/cases.service');

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
