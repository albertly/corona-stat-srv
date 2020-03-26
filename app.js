const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');

const indexRouter = require('./routes/index');
const { closeDb, openDb } = require('./utils/common');
const {addProb} = require('./services/dailyProb.service');
const { getStat } = require('./services/stat.service');
const app = express();

openDb(process.env.MONGO);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


 
cron.schedule(`*/${process.env.PROBE} * * * *`, () => {
  getStat().then(r =>{
    const val = r[r.length-1].new;
    console.log(r);
    console.log('val', val);
    addProb(val);
    console.log( `running a task every minute ${process.env.PROBE}`);  
  });

});

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('err', err);

  res.send(err);
});

module.exports = app;
