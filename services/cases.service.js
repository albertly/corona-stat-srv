const axios = require('axios');
const NodeCache = require("node-cache");

//const myCache = new NodeCache({ stdTTL: 30, checkperiod: 120 });
const key = 'main_table_countries_today11';


exports.getDailyCasesWorldwide = function () {

    const url = 'https://www.worldometers.info/coronavirus/coronavirus-cases/';

    const cacheValue = undefined; // myCache.get(key);

    if (cacheValue == undefined) {
        console.log('axios start 1');
        return axios.get(url).then(r => {
            console.log('axios end 1');

            const startStr = "Highcharts.chart('coronavirus',"
            const start = r.data.indexOf(startStr) + startStr.length;
            const end = r.data.indexOf(");", start);
            const res = r.data.substring(start, end);
            //console.log(res);
            eval('var obj=' + res + '');
            //console.log(obj.xAxis);
            console.log(obj.series[0].data);
            return obj;

            myCache.set(key, reply);
            return reply;
        });
    }

    console.log('cache hitted');
    return new Promise((resolutionFunc, rejectionFunc) => {
        resolutionFunc(cacheValue);
    });


}