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
        log: baseLogger
    };
};
