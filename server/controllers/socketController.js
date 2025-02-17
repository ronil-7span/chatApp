const users = {}

export const socketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('sendName', (username) => {
            users[socket.id] = username;
            socket.broadcast.emit('name', username);
        });

        socket.on('input', (chatMessage) => {
            socket.broadcast.emit('receive', chatMessage); // broadcast sender vagar bijane data send karse
        });

        socket.on('disconnect', () => {
            const username = users[socket.id] || 'Unknown User';
            console.log(`${username} disconnected`);
            socket.broadcast.emit('user-disconnected', username);
            delete users[socket.id];
        });
    });
}

// socket.emit(): Sends a message to the specific client (the sender itself).
// socket.broadcast.emit(): Sends a message to all other clients except the sender.
// io.emit(): Sends a message to all clients, including the sender.