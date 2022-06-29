import expressPino from 'express-pino-logger';

const requestLogger = expressPino({
    level: 'info',
    enabled: true
});

export default requestLogger;
