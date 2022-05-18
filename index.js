const Server = require('./models/server');
require('dotenv').config();

//Db connection
const { dbConnection } = require('./database/config');
dbConnection();

const server = new Server();

server.execute();