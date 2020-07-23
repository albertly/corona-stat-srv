const mongoose = require('mongoose');
require('./env');

exports.closeDb = function closeDb() {
  mongoose.connection.close();
};

exports.openDb = async function openDb(db) {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });

    return console.info(`Successfully connected to ${db}`);
  } catch (error) {
    console.error('Error connecting to database: ', error);
    return process.exit(1);
  }

  // mongoose.connection.on('disconnected', connect);
};

const WebSocket = require('ws');

function heartbeat() {
  this.isAlive = true;
}

let wss;

exports.WSStart = function WSStart(server) {
  wss = new WebSocket.Server({ server, clientTracking: true });
  wss.on('connection', function connection(ws) {
    console.log('wss on connection');

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incoming(data) {
      console.log('ws on message', data);
    });
  });

  wss.on('close', function close() {
    console.log('wss on close');
    clearInterval(interval);
  });
};

function noop() {}

const interval = setInterval(function ping() {
  console.log('setInterval wss.clients.size', wss.clients.size);
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

exports.broadcast = function broadcast(msg) {
  console.log('in broadcast wss.clients.size', wss.clients.size);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log('sending msg', msg);
      client.send(msg);
    }
  });
};

exports.previousData = ['test'];
