const axios = require('axios');
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 1200 });
const KEY = 'table_countries_';
let key = '';


exports.getDailyCasesWorldwide = function (country) {

    let url = 'https://www.worldometers.info/coronavirus/worldwide-graphs/';
    let startStr = "Highcharts.chart('coronavirus',"
    let startStrDeath = "Highcharts.chart('coronavirus-deaths-daily',";
    if (country) {
        url = `https://www.worldometers.info/coronavirus/country/${country}/`;
        startStr = "Highcharts.chart('graph-cases-daily',";
        startStrDeath = "Highcharts.chart('graph-deaths-daily',";
    }

    key = `${KEY}${country}`
    const cacheValue = myCache.get(key);

    if (cacheValue == undefined) {

        const promise1 = Scrape(url, startStr);
        const promise2 = Scrape(url, startStrDeath);
        return Promise.all([promise1, promise2]).then(r => {
            myCache.set(key, r);
            return r;
        });
    }

    console.log('cache hitted ' + key);
    return new Promise((resolutionFunc, rejectionFunc) => {
        resolutionFunc(cacheValue);
    });


}

function Scrape(url, startStr) {

    return axios.get(url).then(r => {
  

        const start = r.data.indexOf(startStr) + startStr.length;
        const end = r.data.indexOf(");", start);
        const res = r.data.substring(start, end);

        eval('var obj=' + res + '');

        return obj;

       // myCache.set(key, reply);
       // return reply;
    })
    .catch(e => console.log(e));

}