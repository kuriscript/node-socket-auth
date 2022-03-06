const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const domainsFromEnv = process.env.ALLOWED_DOMAINS.split(',');

const whiteList = domainsFromEnv.map(domain => domain.trim());

//Db connection
const { dbConnection } = require('./database/config');
dbConnection();

//App de Express
const app = express();

//Lectura y parseo del body
app.use(express.json());


//Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server, {
    cors: {
        origin: whiteList,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }
});
require('./sockets/socket');


//public path
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//routes

app.use('/api/auth', require('./routes/auth'));

app.use('/api/users', require('./routes/users'));

server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log(`Server is running on port ${process.env.PORT} and enabled to domains ${process.env.ALLOWED_DOMAINS}`);
});