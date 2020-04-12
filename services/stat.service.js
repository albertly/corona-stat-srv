const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 30, checkperiod: 120 });
const keyToday = 'main_table_countries_today';
const keyYesterday = 'main_table_countries_yesterday';

exports.getStat = function (today = true) {

  const url = 'https://www.worldometers.info/coronavirus';

  const key = today ? keyToday : keyYesterday;

  const cacheValue = myCache.get(key);

  if (cacheValue == undefined) {
  
    return axios.get(url).then(r => {
  
      const reply = [];

      const $ = cheerio.load(r.data, {
        xml: {
          normalizeWhitespace: true,
        }
      });

      const skipCountries = ['Europe', 'World', 'Asia', 'South America', 'Africa', 'Oceania', 'North America', ''];
      const fields = ['country', 'total', 'new', 'totalDeaths', 'newDeaths', 'totalRecovered', 'active', 'serious', 'totCasesPer1m', , , , , ,];

      let tableName = '#main_table_countries_today';
      if (!today) {
        tableName = '#main_table_countries_yesterday'
      }
      const data = $(`${tableName} > tbody > tr`);

      data.each(function (i) {
        if (i !== 0) {
          let obj = {};
          $(this).find('td').each(function (j) {
            if (fields[j]) {
              obj[fields[j]] = $(this).text();
            }
          })

          if (skipCountries.indexOf(obj.country.trim()) == -1) {
            reply.push(obj);
          }
        }
      });

      myCache.set(key, reply);
      return reply;
    });
  }

  console.log('cache hitted');
  return new Promise( (resolutionFunc,rejectionFunc) => {
    resolutionFunc(cacheValue);
  });


}