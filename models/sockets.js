
class Sockets {

    constructor(io) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {
        // on connection

        this.io.on('connection', (socket) => {
            //escuchar evento
            console.log('socket connected');

            socket.on('disconnect', () => {
                console.log('socket disconnected');
            });
        });
    }

}

module.exports = Sockets;