const winston = require('winston');
const expressWinston = require('express-winston');

const prodLogging = [
  new winston.transports.File({ filename: './logging/error.log', level: 'error' }),
  new winston.transports.File({ name: 'combined_log', filename: './logging/combined.log' })
];

    let winstonLogger = null;
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      // modify the logger if this is production to save to a file for later review
    winstonLogger = expressWinston.logger({
            transports: [
              new winston.transports.Console({
                json: true,
                colorize: true,
                timestamp: true,
                prettyPrint: true,
                showLevel: false
              }),
              new winston.transports.File({ filename: './logging/error.log', level: 'error' }),
              new winston.transports.File({ name: 'combined_log', filename: './logging/combined.log' })
            ],
            meta: false, // optional: control whether you want to log the meta data about the request (default to true)
            colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
            ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
          })
    }

module.exports = winstonLogger;
