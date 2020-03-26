const mongoose = require('mongoose');
require('./env');


exports.closeDb =  function closeDb () {
    mongoose.connection.close();
}

exports.openDb =  async function openDb ( db )  {
    
    console.log(typeof mongoose.Schema);

    try {
        await mongoose.connect(db, { useNewUrlParser: true });

        return console.info(`Successfully connected to ${db}`);
    }
    catch (error) {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
    }

   // mongoose.connection.on('disconnected', connect);
};