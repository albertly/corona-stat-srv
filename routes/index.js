var express = require('express');
var axios = require('axios');
const cheerio = require('cheerio');

var router = express.Router();


router.get('/', function (req, res, next) {
  const url = 'https://www.worldometers.info/coronavirus';

  console.log('axios start');
  axios.get(url).then(r => {
    console.log('axios end');
    const reply = [];

    const $ = cheerio.load(r.data, {
      xml: {
        normalizeWhitespace: true,
      }
    });

    const fields = ['country','total', 'new','newDeaths','totalRecovered','active','serious','totCasesPer1m',,,,,,];

    const data = $('#main_table_countries_today > tbody > tr');
    
    data.each(function (i) {
      let obj = {};
      $(this).find('td').each(function (j) {
        if (fields[j]) {
          obj[fields[j]] =  $(this).text();
        }
      })

    reply.push(obj);

    });

    res.json(reply);

  }).
    catch(e => {
      console.log('e', e);
    });

});

module.exports = router;
