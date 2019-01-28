module.exports = app => {

    app.socket.on('connection', (socket) => {
        socket.on('is-online', (msg) => {
            app.socket.emit('online');
        });
    });

};