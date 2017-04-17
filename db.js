'use strict';

const mysql = require('mysql');

const BaseError = require('psychonautwiki-bifrost-testutils/error');

class DB {
    constructor({constants, utils}) {
        this._utils = utils;
        this._log = utils.log.child({
            type: 'database'
        });

        const {user, host, database} = constants.mysql;
        this._mysqlInfo = {user, host, database};

        this._connection = mysql.createConnection(constants.mysql);

        this._init();
        this._setupCleanup();
    }

    _setupCleanup() {
        this._utils.registerTeardown(() => (this._teardown()), true);
    }

    _init() {
        this._log.trace('Trying to connect...');
        this._connection.connect();
        this._log.info(`Connected to ${this._mysqlInfo.user}@${this._mysqlInfo.host}/${this._mysqlInfo.database}`);
    }

    * query(msg) {
        return yield new Promise((res, rej) => {
            this._connection.query(msg, (err, results, fields) => {
                if (err) {
                    return rej(new this.DBError(err));
                }

                res({results, fields});
            });
        });
    }

    _teardown() {
        this._connection.end();
        this._log.info('Disconnected');
    }
}

DB.prototype.DBError = class DBError extends BaseError {};

module.exports = DB;