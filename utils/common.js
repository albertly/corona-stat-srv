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

const wss = new WebSocket.Server({ port: 8080 });

exports.WSStart = function WSStart() {
    wss.on('connection', function connection(ws) {
        console.log('connection data');
        wss.clients.add(ws);

        ws.on('message', function incoming(data) {
            console.log('data', data);
        });
    });
}

exports.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            console.log('send data');
            client.send(msg);
        }
    });
}
