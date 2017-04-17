'use strict';

const mysql = require('mysql');

const BaseError = require('psychonautwiki-bifrost-testutils/error');

class DB {
    constructor({constants, utils}) {
        this.utils = utils;
        this.log = utils.log.logger.child({
            type: 'database'
        });

        const {user, host, database} = constants.mysql;
        this.mysqlInfo = {user, host, database};

        this.connection = mysql.createConnection(constants.mysql);

        this._init();
        this._setupCleanup();
    }

    _setupCleanup() {
        this.utils.registerTeardown(() => {this._teardown();}, true);
    }

    _init() {
        this.log.trace('Trying to connect...');
        this.connection.connect();
        this.log.info(`Connected to ${this.mysqlInfo.user}@${this.mysqlInfo.host}/${this.mysqlInfo.database}`);
    }

    * query(msg) {
        return yield new Promise((res, rej) => {
            this.connection.query(msg, (err, results, fields) => {
                if (err) {
                    return rej(new this.DBError(err));
                }

                res({results, fields});
            });
        });
    }

    _teardown() {
        this.connection.end();
        this.log.info('Disconnected');
    }
}

DB.prototype.DBError = class DBError extends BaseError {};

module.exports = DB;