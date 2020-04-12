const axios = require('axios');
const NodeCache = require("node-cache");

//const myCache = new NodeCache({ stdTTL: 30, checkperiod: 120 });
const key = 'main_table_countries_today11';


exports.getDailyCasesWorldwide = function (country) {
    //https://www.worldometers.info/coronavirus/coronavirus-death-toll/
    let url = 'https://www.worldometers.info/coronavirus/coronavirus-cases/';
    let startStr = "Highcharts.chart('coronavirus',"
    if (country) {
        //https://www.worldometers.info/coronavirus/country/israel/
        url = `https://www.worldometers.info/coronavirus/country/${country}/`;
        startStr = "Highcharts.chart('graph-cases-daily',";
    }
    //
    // Highcharts.chart('graph-deaths-daily',
    const cacheValue = undefined; // myCache.get(key);

    if (cacheValue == undefined) {
        console.log('before Scrape', url)
        return Scrape(url, startStr);
    }

    
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