const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const { getProbByDate } = require('../services/dailyProb.service');
const { getStat } = require('../services/stat.service');

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
