'use strict';

const _ = require('lodash');

const Promise = require('bluebird');
const async = Promise.coroutine;

class UserHandler {
    constructor({user, db, log}) {
        this._utils = {user, db, log};

        this._log = log.child({
            type: 'coreHandler'
        });

        this._currentUser = null;
    }

    _attach(socket) {
        this._socket = socket;

        this._setupListeners();
    }

    /* global: this._socket.broadcast */

    _setupListeners() {
        const self = this;

        /* base listeners */
        this._socket.on('auth', async(function* (msg) {
            yield* self._handleAuth(msg);
        }));

        this._socket.on('disconnect', this._handleDisconnect.bind(this));

        this._socket.on('user', async(function* (msg) {
            yield* self._privilegedListener(msg, self._handleUserRequest.bind(self));
        }));
    }

    * _privilegedListener(msg, cb) {
        if (this._currentUser === null) {
            return this._socket.emit('ack', {
                type: 'need_auth'
            });
        }

        yield* cb(msg);
    }

    * _handleAuth({name, token}) {
        const res = yield* this._utils.user.getByToken(token);

        const user = _.get(res, 'results.0', null);

        if (user === null || user.user_name !== name) {
            return this._socket.emit('ack', {
                type: 'auth_failed'
            });
        }

        this._currentUser = user;

        this._socket.emit('ack', {
            type: 'auth_success'
        });
    }

    * _handleUserRequest () {
        const {
            user_id,
            user_name,
            user_real_name,
            user_editcount,
            user_email
        } = this._currentUser;

        this._socket.emit('ack', {
            type: 'user',
            data: {
                user_id,
                user_name,
                user_real_name,
                user_editcount,
                user_email
            }
        });
    }

    _handleDisconnect() {
        this._log.warn('not implemented');
    }

    static * attach(socket, utils) {
        const userHandler = new UserHandler(utils);

        userHandler._attach(socket);
    }
}

UserHandler.prototype.UNUSED = async(function*() {
    /* base listeners */
    this._on('auth', this._handleAuth.bind(this));
    this._on('disconnect', this._handleDisconnect.bind(this));
});

module.exports = UserHandler;