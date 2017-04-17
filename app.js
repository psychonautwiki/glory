'use strict';

const http = require('http');

const Promise = require('bluebird');

const express = require('express');
const socketIo = require('socket.io');

const constants = require('./constants');
const {registerTeardown, log} = require('./utils')(constants);

const DB = require('./db');
const db = new DB({
    constants,
    utils: {registerTeardown, log}
});

const User = require('./user');
const user = new User({
    db
});

const CoreHandler = require('./coreHandler');
const coreHandler = new CoreHandler({
    db, user, log
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

server.listen(port, () => {
    log.info(`We are online on port ${port}.`);
});

app.use(express.static(__dirname + '/public'));

coreHandler.attach(io);

registerTeardown(err => {
    if (err) {
        console.log(err);
    }

    process.exit();
});