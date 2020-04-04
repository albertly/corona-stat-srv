const axios = require('axios');
const cheerio = require('cheerio');

exports.getStat = function (today = true) {

  const url = 'https://www.worldometers.info/coronavirus';

  console.log('axios start 1');
  return axios.get(url).then(r => {
    console.log('axios end 1');
    const reply = [];

    const $ = cheerio.load(r.data, {
      xml: {
        normalizeWhitespace: true,
      }
    });

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
        if (obj.county !== 'World') {
          reply.push(obj);
        }
      }
    });

    return reply;
  });
}