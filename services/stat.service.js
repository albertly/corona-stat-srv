const axios = require('axios');
const cheerio = require('cheerio');

exports.getStat = function () {

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
  
      const fields = ['country','total', 'new', 'totalDeaths', 'newDeaths','totalRecovered','active','serious','totCasesPer1m',,,,,,];
  
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

      return reply;
    });
}