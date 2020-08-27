require('./env');
const mongoose = require('mongoose');
const logger = require('./logger');

exports.closeDb = function closeDb() {
  mongoose.connection.close();
};

exports.openDb = async function openDb(db) {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });

    return logger.info(`Successfully connected to ${db}`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
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
    logger.debug('wss on connection');

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incoming(data) {
      logger.debug(`ws on message ${data}`);
    });
  });

  wss.on('close', function close() {
    logger.debug('wss on close');
    clearInterval(interval);
  });
};

function noop() {}

const interval = setInterval(function ping() {
  logger.debug(`setInterval wss.clients.size ${wss.clients.size}`);
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

exports.broadcast = function broadcast(msg) {
  logger.debug(`in broadcast wss.clients.size ${wss.clients.size}`);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      logger.debug(`sending msg ${msg}`);
      client.send(msg);
    }
  });
};

exports.previousData = ['test'];
