const { checkJWT } = require("../helpers/jwt");
const Form  = require("./form");

class Sockets {

    constructor(io) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {

        this.io.on('connection', (socket) => {
            // const [valido, uid] = checkJWT(socket.handshake.query['x-token']);

            // if (!valido) {
            //     console.log('socket no identificado');
            //     return socket.disconnect();
            // }

            socket.on('new-entry', (data) => {
                socket.broadcast.emit('update-report', data);
                socket.broadcast.emit('new-entry-notification', data);

            });

            socket.on('form-updated', async (data) => {
                console.log('form-updated');
                const form = await Form.findById(data.id);
                data.path = form.path;
                data.isStepAfter = form.isStep;

                if (data.isStepBefore && data.isStepBefore !== form.isStep) {
                    socket.broadcast.emit('update-type-form', data);
                }

                this.io.emit('update-form', data);
            });

            socket.on('question-updated', async (data) => {

                const form = await Form.findOne({ categories: data.id });
                data.path = form.path;

                this.io.emit('update-form', data);

            });

            socket.on('disconnect', () => {
                console.log('socket disconnected');
            });
        });
    }

}

module.exports = Sockets;