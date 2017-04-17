'use strict';

const BaseError = require('psychonautwiki-bifrost-testutils/error');

class User {
    constructor ({db}) {
        this.db = db;
    }

    _byTokenQuery(token) {
        return `SELECT * FROM pw_user WHERE user_token="${token}"`;
    }

    * getByToken (token) {
        return yield* this.db.query(this._byTokenQuery(token));
    }
}

User.prototype.NotFound = class NotFound extends BaseError {};

module.exports = User;