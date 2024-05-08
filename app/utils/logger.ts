'use server';

import winston from 'winston';

const { combine, colorize, printf, timestamp } = winston.format;

let _logger: winston.Logger | undefined = undefined;

const logFormat = printf(function (info) {
  return info.stack ? getErrorLog(info) : `${info.timestamp} [${info.level}] ${info.message}`;
});

const getErrorLog = (info: winston.Logform.TransformableInfo) => {
  let logMessage = `${info.timestamp} [${info.level}]: ${info.name}`;

  logMessage += `\n\tmessage: ${info.message}`;
  if (info.resource) {
    logMessage += `\n\tresource: ${info.resource}`;
  }
  logMessage += `\n\tstack: ${info.stack}`;
  return logMessage;
};

const createdLogger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({
      format: new Date().toISOString(),
    }),
    logFormat,
  ),
  transports: [new winston.transports.Console({ stderrLevels: ['error'] })],
});

const getLogger = (): winston.Logger => {
  if (!_logger) {
    _logger = createdLogger;
  }
  return _logger;
};

export default getLogger;
