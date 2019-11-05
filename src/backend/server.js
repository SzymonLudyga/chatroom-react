const express = require('express');

const app = express();
const port = 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { addMessage, checkMessage } = require('./utils/messageUtils');
const { changeUserRoom, checkUserRoom } = require('./utils/userUtils');
const { errorMessages, errorTypes } = require('./utils/errorMessages');

/* eslint-disable-next-line no-unused-vars */
const { mongoose } = require('./db/mongooseConfig');

const usersRouter = require('./router/user');
const roomsRouter = require('./router/room');
const messagesRouter = require('./router/message');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/rooms', roomsRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

io.on('connection', (socket) => {
    console.log('\n\n', socket.id, 'a user connected\n\n');

    socket.on('disconnect', () => {
        console.log('\n\n', socket.id, 'user disconnected\n\n');
    });

    socket.on('join-room', async (data) => {
        try {
            socket.join(data.room);
            const room = await checkUserRoom(data.user);
            if (data.room !== room) {
                // - if new room of the user
                socket.join(data.room);
                // 1. then update user list
                changeUserRoom(data.user, data.room, (userList) => {
                    // 2. then info to everyone to fetch user list
                    io.to(data.room).emit(
                        'update-user-list',
                        userList
                    );
                });
                addMessage({
                    user: 'Admin',
                    room: data.room,
                    message: 'Welcome to the app'
                }, (res) => {
                    // 3. then info to socket with welcome message
                    // socket.emit - emits event to single connection(socket)
                    socket.emit('new-message', res);
                });
                addMessage({
                    user: 'Admin',
                    room: data.room,
                    message: `${data.user} has joined`
                }, (res) => {
                    // 4. then info to everyone but socket
                    //      that user was connected
                    // socket.broadcast.emit - emits event to
                    //      every connection but the socket
                    socket.broadcast.to(data.room).emit('new-message', res);
                });
            }
        } catch (err) {
            console.log(err.message);
            socket.emit('error-message', {
                message: err.message,
                type: err.message === errorMessages.addMessageError
                    ? errorTypes.MESSAGE_ERROR
                    : errorTypes.USER_ERROR
            });
        }
    });

    socket.on('leave-room', (data) => {
        console.log('\n\nleave room\n\n');
        console.log(data);

        socket.leave(data.room);

        try {
            addMessage({
                user: 'Admin',
                room: data.room,
                message: `${data.user} left the room`
            }, (res) => {
                // 1. Info to everyone but the socket to update user list
                // socket.broadcast.emit - emits event
                //      to every connection but the socket
                socket.broadcast.to(data.room).emit('new-message', res);
            });

            changeUserRoom(data.user, null, (userList) => {
                // 2. Info to everyone but the socket that user left the room
                socket.broadcast.to(data.room).emit(
                    'update-user-list',
                    userList
                );
            });
        } catch (err) {
            console.log(err.message);
            socket.emit('error-message', {
                message: err.message,
                type: err.message === errorMessages.addMessageError
                    ? errorTypes.MESSAGE_ERROR
                    : errorTypes.USER_ERROR
            });
        }
    });

    socket.on('create-message', (data) => {
        console.log('\n\ncreate message\n\n');
        console.log('DATA', data);

        try {
            // 1. check message and user
            checkMessage(data);
            // 2. add message to database
            addMessage(data, (res) => {
                // 3. info to everyone to fetch messages
                io.to(data.room).emit('new-message', res);
            });
        } catch (err) {
            console.log(err.message);
            socket.emit('error-message', {
                message: err.message,
                type: err.message === errorMessages.addMessageError
                    ? errorTypes.MESSAGE_ERROR
                    : errorTypes.SEND_ERROR
            });
        }
    });
});

server.listen(port, () => {
    console.log(`## SERVER ON PORT ${port} ##`);
});

module.exports = { server };
