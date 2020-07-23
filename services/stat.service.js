const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const { previousData } = require('../utils/common');

const myCache = new NodeCache({ stdTTL: 30, checkperiod: 120 });
const keyToday = 'main_table_countries_today';
const keyYesterday = 'main_table_countries_yesterday';

function compareArr(new_, old_) {
  const res = [];
  let total = '';
  let newTotal = '';

  if (old_ == undefined || old_.length == 0) {
    return { res: new_, new: newTotal, total };
  }

  new_.forEach((obj) => {
    const oldObj = old_.find((e) => obj.country == e.country);
    if (oldObj && oldObj.new != obj.new) {
      if (obj.country == 'Total:') {
        total = obj.total;
        newTotal = obj.new;
      } else {
        res.push({ ...obj, newOld: oldObj.new });
      }
    }
  });

  return { res };
}

exports.getStat = function (today = true) {
  const url = 'https://www.worldometers.info/coronavirus';

  const key = today ? keyToday : keyYesterday;

  const cacheValue = myCache.get(key);

  if (cacheValue == undefined) {
    return axios.get(url).then((r) => {
      const reply = [];

      const $ = cheerio.load(r.data, {
        xml: {
          normalizeWhitespace: true,
        },
      });

      const skipCountries = [
        'Europe',
        'World',
        'Asia',
        'South America',
        'Africa',
        'Oceania',
        'North America',
        '',
      ];
      const fields = [
        ,
        'country',
        'total',
        'new',
        'totalDeaths',
        'newDeaths',
        'totalRecovered',
        'newRecovered',
        'active',
        'serious',
        'totCasesPer1m',
        'dPer1m',
        'tTests',
        'tPer1m',
        'Po',
        'Cont',
        '1CperXppl',
        '1DperXppl',
        '1TperXppl',
      ];

      let tableName = '#main_table_countries_today';
      if (!today) {
        tableName = '#main_table_countries_yesterday';
      }
      const data = $(`${tableName} > tbody > tr`);

      data.each(function (i) {
        if (i !== 0) {
          let obj = {};
          $(this)
            .find('td')
            .each(function (j) {
              if (fields[j]) {
                obj[fields[j]] = $(this).text();
              }
            });

          if (skipCountries.indexOf(obj.country.trim()) == -1) {
            reply.push(obj);
          }
        }
      });

      if (previousData.length && today) {
        const delta = compareArr(reply, previousData);

        if (delta.length) {
          console.log('delta found :', delta);
        }
      }
      previousData = reply;

      myCache.set(key, reply);
      return reply;
    });
  }

  console.log('cache hitted ' + key);
  return new Promise((resolutionFunc, rejectionFunc) => {
    resolutionFunc(cacheValue);
  });
};
