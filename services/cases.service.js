const axios = require('axios');
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 1200 });
const KEY = 'table_countries_';
let key = '';


exports.getDailyCasesWorldwide = function (country) {

    let url = 'https://www.worldometers.info/coronavirus/worldwide-graphs/';
    let startStr = "Highcharts.chart('coronavirus_cases_daily',"
    let startStrDeath = "Highcharts.chart('coronavirus-deaths-daily',";
    let startStrActive = "Highcharts.chart('graph-active-cases-total',";
    if (country) {
        url = `https://www.worldometers.info/coronavirus/country/${country}/`;
        startStr = "Highcharts.chart('graph-cases-daily',";
        startStrDeath = "Highcharts.chart('graph-deaths-daily',";
        startStrActive = "Highcharts.chart('graph-active-cases-total',";      
    }

    key = `${KEY}${country}`;
    const cacheValue = myCache.get(key);

    if (cacheValue == undefined) {

        return axios.get(url).then(r => {
            const value1 = Scrape(r, startStr);
            const value2 = Scrape(r, startStrDeath);
            const value3 = Scrape(r, startStrActive);
            
            const obj = [value1, value2, value3];
            myCache.set(key, obj);
            return obj;
    
        })
        .catch(e => {
            console.log(e);
            return new Promise((resolve, reject) => {
                reject(e);
            });
        });

    }

    console.log('cache hitted ' + key);
    return new Promise((resolve, reject) => {
        resolve(cacheValue);
    });


}

function Scrape(r, startStr) {
        const startPos = r.data.indexOf(startStr);
        if (startPos === -1) {
            return {};
        }

        const start = startPos + startStr.length;
        const end = r.data.indexOf(`responsive: {`, start);
        const res = r.data.substring(start, end);
        
        console.log('res', res)
        eval('var obj=' + res + '}');

        return obj;
}