require('./env');
//const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logger = createLogger();
// {
//   level: 'info',
//   format: format.combine(format.timestamp(), format.prettyPrint()),
//   // defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with level `error` and below to `error.log`
//     // - Write all logs with level `info` and below to `combined.log`
//     //
//     new transports.File({ filename: 'error.log', level: 'error' }),
//     new transports.File({ filename: 'combined.log' }),
//   ],
// });

if (process.env.FILE) {
  logger.add(
    new transports.File({
      filename: 'combined.log',
      level: process.env.FILE,
      format: format.combine(format.timestamp(), format.prettyPrint()),
    })
  );
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.CONSOLE) {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });
  logger.add(
    new transports.Console({
      level: process.env.CONSOLE,
      format: combine(timestamp(), format.colorize(), myFormat),
    })
  );
}

module.exports = logger;
