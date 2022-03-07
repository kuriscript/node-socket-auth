const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
const Sockets = require('./sockets');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        //http server
        this.server = http.createServer(this.app);

        //socket.io
        this.io = socketIO(this.server, {
            //configuraciones

        });
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        this.app.use(cors());

    }

    configureSockets() {
        new Sockets(this.io);
    }

    routes() {
        this.app.use('/api/auth', require('../routes/auth'));

        this.app.use('/api/users', require('../routes/users'));
    }

    execute() {
        // initialize middlewares
        this.middlewares();

        // initialize sockets
        this.configureSockets();

        // initialize routes
        this.routes();

        // initialize server

        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = Server;