
const moment = require('moment');

const DailyProb = require('../models/dailyProb');

exports.addProb = async function (value) {

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log('date', date);
    const probeTime = today.getHours() + ":" + today.getMinutes();

    try {    
        const dailyProb = new DailyProb({
            date,
            probeTime,
            newCases: value,
        });

        await dailyProb.save();   
    }
    catch(err) {
        throw err;
    }
};

exports.getProbByDate = async function (d) {

    const fromD = new Date(d);
    let tillD = new Date(d);
    tillD.setDate(tillD.getDate() + 1);
    
    const fromS = fromD.getFullYear()+'-'+(fromD.getMonth()+1)+'-'+fromD.getDate();
    const tillS = tillD.getFullYear()+'-'+(tillD.getMonth()+1)+'-'+tillD.getDate();

    try {    
        console.log('fromD', fromD);
        console.log('tillD', tillD);
        return await DailyProb.find({"date": {"$gte": fromD.toUTCString(), "$lt": tillD.toUTCString()}});
  
    }
    catch(err) {
        throw err;
    }
};

