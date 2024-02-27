import winston from 'winston';
const { combine, colorize, printf } = winston.format;

let date = new Date().toISOString();

const logFormat = printf(function (info) {
  return info.stack ? getErrorLog(info) : `${date} [${info.level}] ${info.message}`;
});

const getErrorLog = (info: winston.Logform.TransformableInfo) => {
  let logMessage = `${date} [${info.level}]: ${info.name}`;

  logMessage += `\n\tmessage: ${info.message}`;
  if (info.resource) {
    logMessage += `\n\tresource: ${info.resource}`;
  }
  logMessage += `\n\tstack: ${info.stack}`;
  return logMessage;
};

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), logFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
