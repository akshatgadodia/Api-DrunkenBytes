const winston = require('winston');
const path = require('path');

const logsDir = path.join(__dirname, "..", 'logs');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(logsDir, 'access.log')
      })
    ]
  });

module.exports = logger