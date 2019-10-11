const express = require('express');
const moment = require('moment');

const app = express();
const port = 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { addMessage } = require('./utils/messageUtils');
const { getUsers, changeUserRoom, checkUserRoom } = require('./utils/userUtils');

const { mongoose } = require('./db/mongooseConfig');
const { User } = require('./db/User');
const { Message } = require('./db/Message');

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
    console.log('\n\n', socket.id,'a user connected\n\n');

    socket.on('disconnect', () => {
        // user disconnected
        //  - wait for user (refresh scenario - 5ms)
        //  FAIL:
        //  - update room database (remove user)
        //  - info to everyone but socket to fetch user list
        //  - info to everyone but socket that user was disconnected
        //  PASS:
        //  - new timestamp (older messages not seen, only after approval of other users)
        //  - option to fetch older messages 
        console.log('\n\n', socket.id, 'user disconnected\n\n');
    });

    socket.on('join-room', async (data) => {
        // console.log('\n\njoin room\n\n')
        // console.log(data);
        // console.log("ID", socket.id);
        socket.join(data.room);
        const room = await checkUserRoom(data.user);
        
        if(data.room !== room) {
            // - if new room of the user 
            socket.join(data.room);
            // 1. then update user list
            changeUserRoom(data.user, data.room, userList => {
                // console.log("USERS", userList)
                // 2. then info to everyone to fetch user list
                io.to(data.room).emit(
                    'update-user-list',
                    userList
                );
            });
            
            addMessage({ user: 'Admin', room: data.room, message: 'Welcome to the app' }, (res) => {
                // console.log(res)
                // 3. then info to socket with welcome message
                // socket.emit - emits event to single connection(socket)
                socket.emit('new-message', res);
            });
            addMessage({ user: 'Admin', room: data.room, message: `${data.user} has joined` }, (res) => {
                // console.log(res)
                // 4. then info to everyone but socket that user was connected
                // socket.broadcast.emit - emits event to every connection but the socket
                socket.broadcast.to(data.room).emit('new-message', res);
            });
        }
    });

    socket.on('leave-room', (data) => {
        console.log('\n\nleave room\n\n')
        console.log(data);

        socket.leave(data.room);

        addMessage({ user: 'Admin', room: data.room, message: `${data.user} left the room` }, (res) => {
            // console.log(res)
            // 1. Info to everyone but the socket to update user list
            // socket.broadcast.emit - emits event to every connection but the socket
            socket.broadcast.to(data.room).emit('new-message', res);
        });

        changeUserRoom(data.user, null, userList => {
            // console.log("USERS", userList)
            // 2. Info to everyone but the socket that user left the room
            socket.broadcast.to(data.room).emit(
                'update-user-list',
                userList
            );
        })
    });

    socket.on('create-message', (data) => {
        console.log('\n\ncreate message\n\n')
        console.log('DATA', data);

        try {
            // 1. add message to database
            addMessage(data, (res) => {
                console.log(res)
                // 2. info to everyone to fetch messages
                io.to(data.room).emit('new-message', res);
            });
        } catch (err) {
            console.log(err);
        }
    });
});

server.listen(port, () => {
    console.log(`## SERVER ON PORT ${port} ##`);
});
