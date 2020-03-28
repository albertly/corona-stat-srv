
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

    try {    
        return await DailyProb.find(
            {"date": 
                {"$gte": fromD.toGMTString(), "$lt": tillD.toGMTString()}
            });
    }
    catch(err) {
        throw err;
    }
};

