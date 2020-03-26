const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const { getProbByDate } = require('../services/dailyProb.service');
const { getStat } = require('../services/stat.service');

router.get('/prob', async function (req, res, next) {
  const result = await getProbByDate('2020-03-26');

  res.json(result);
});

router.get('/', function (req, res, next) {

  getStat().then(r => {
    res.json(r);
  })
  .catch(e => {
      console.log('e', e);
  });

});

module.exports = router;
