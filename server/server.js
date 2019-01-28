const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const consign = require('consign');
const sqlite3 = require('sqlite3');
const db = require('./database/db');
const appPath = __dirname;

app.db = db;
app.socket = io;
app.path = appPath;

consign()
    .then('./config/middlewares.js')
    .then('./validate')
    .then('./api')
    .then('./config/routes.js')
    .into(app);

server.listen(3003);