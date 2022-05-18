
const { connectedUser, disconnectedUser } = require('../controllers/socket');
const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');

//Socket messages

io.on('connect', client => {

    const [valido, uid] = checkJWT(client.handshake.headers['x-token']);

    //Veriry id user is valid

    if (!valido) {
        return client.disconnect();
    }

    //Connected user

    connectedUser(uid);

    client.on('disconnect', () => {
        disconnectedUser(uid);
    });

    // client.on('message', data => {
    //     console.log(data);
    //     client.broadcast.emit('message', data);
    // });
});

