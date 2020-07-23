const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const { closeDb, openDb, WSStart } = require('./utils/common');
const {addProb} = require('./services/dailyProb.service');
const { getStat } = require('./services/stat.service');
const app = express();

openDb(process.env.MONGO);

const corsOptions = {
  exposedHeaders: ['date', 'etag'],
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(express.static(path.join(__dirname, 'public')));


 
cron.schedule(`*/${process.env.PROBE} * * * *`, () => {
  getStat().then(r =>{
    const val = r[r.length-1].new;
    addProb(val);
    console.log( `running a task every minute ${process.env.PROBE}`);  
  });

});



/////////////////////
// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   console.log('connection data');
//   wss.clients.add(ws);
//   ws.on('message', function incoming(data) {
//     console.log('data', data);
//     console.log('wss.clients', wss.clients.size);
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         console.log('send data');
//         client.send(data);
//       }
//     });
//   });
// });
///////////////////////////////////

app.use('/', indexRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   console.log('err', err);

//   res.send(err);
// });

module.exports = app;
