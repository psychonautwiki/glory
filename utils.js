'use strict';

const bunyan = require('bunyan');

module.exports = constants => {
    const baseLogger = bunyan.createLogger({
        name: constants.name
    });

    return {
        registerTeardown(cb, onlyExit) {
            process.on('exit', cb);

            if (onlyExit) {
                return;
            }

            process.on('SIGINT', cb);
            process.on('uncaughtException', cb);
        },
        log: {
            info: (...args) => baseLogger.info(args),
            warn: (...args) => baseLogger.warn(args),
            trace: (...args) => baseLogger.trace(args),
            error: (...args) => baseLogger.error(args),
            logger: baseLogger
        }
    };
};
