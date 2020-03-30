const mongoose = require('mongoose');
require('./env');


exports.closeDb = function closeDb() {
    mongoose.connection.close();
}

exports.openDb = async function openDb(db) {


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


const WebSocket = require('ws');

let wss;

exports.WSStart = function WSStart(server) {
    wss = new WebSocket.Server({server});
    wss.on('connection', function connection(ws) {
        console.log('connection data');
        wss.clients.add(ws);

        ws.on('message', function incoming(data) {
            console.log('data', data);
        });
    });
}

exports.broadcast = function broadcast(msg) {
    console.log('in broadcast');
    wss.clients.forEach(function each(client) {
        console.log('client');
      //  if (client.readyState === WebSocket.OPEN) {
            console.log('send data');
            client.send(msg);
       // }
    });
}
