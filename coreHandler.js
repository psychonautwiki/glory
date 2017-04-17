'use strict';

const Promise = require('bluebird');

const UserHandler = require('./userHandler');

class CoreHandler {
    constructor({user, db, log}) {
        this._utils = {user, db, log};
        this._user = user;
        this._db = db;
        this._log = log.child({
            type: 'coreHandler'
        });
    }

    attach(io) {
        const self = this;

        io.on('connection', Promise.coroutine(function* (socket) {
            yield* UserHandler.attach(socket, self._utils);
        }));
    }
}

module.exports = CoreHandler;