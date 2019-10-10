// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketIO = require('socket.io');
// // const { generateMessage } = require('./utils/message');
// // const { isRealString } = require('./utils/validation');
// // const { Users } = require('./utils/users');
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// // const WebSocket = require('ws');

// // const wss = new WebSocket.Server({ port: 3000 });
// // console.log(wss);

// // const users = new Users();

// app.use(express.static('dist'));

// // case insesitive, unique names, chatrooms displayed

// io.on('connection', (socket) => {
//     console.log('New user connected');

//     socket.on('connect', () => {
//         console.log("connect");
//         // const user = users.getUser(socket.id);

//         // if (user && isRealString(message.text)) {
//         //     // io.emit - emits event to every connection
//         //     // io.to(roomName).emit() - emit to every connection in room
//         //     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
//         // }
//         // callback();
//     });

//     // socket.on('join', (params, callback) => {
//     //     if (!isRealString(params.name) || !isRealString(params.room)) {
//     //         return callback('Name and room name are required');
//     //     }

//     //     socket.join(params.room);
//     //     users.removeUser(socket.id);
//     //     users.addUser(socket.id, params.name, params.room);

//     //     io.to(params.room).emit(
//     //         'update-user-list',
//     //         users.getUsersList(params.room)
//     //     );

//     // socket.emit - emits event to single connection
//     // socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

//     // socket.broadcast.emit - emits event to every connection but the socket itself
//     // socket.broadcast
//     //     .to(params.room)
//     //     .emit(
//     //         'newMessage',
//     //         generateMessage('Admin', `${params.name} has joined.`)
//     //     );

//     // callback();
//     // });

//     socket.on('message', (message) => {
//         console.log(message);
//         // const user = users.getUser(socket.id);

//         // if (user && isRealString(message.text)) {
//         //     // io.emit - emits event to every connection
//         //     // io.to(roomName).emit() - emit to every connection in room
//         //     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
//         // }
//         // callback();
//     });

//     socket.on('disconnect', () => {
//         // const user = users.removeUser(socket.id);
//         // if (user) {
//         //     io.to(user.room).emit('update-user-list', users.getUsersList(user.room));
//         //     io.to(user.room).emit(
//         //         'newMessage',
//         //         generateMessage('Admin', `${user.name} has left the room.`)
//         //     );
//         // }
//         console.log('Client disconnected...');
//     });
// });


// const port = process.env.PORT || 3000;

// app.listen(port, () => console.log(`Listening on port ${port}!`));

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
        console.log('\n\njoin room\n\n')
        console.log(data);
        console.log("ID", socket.id);
        socket.join(data.room);
        const room = await checkUserRoom(data.user);
        
        if(data.room !== room) {
            // - if new room of the user 
            console.log("SPRAWDZAM");
            socket.join(data.room);
            // 1. then update user list
            changeUserRoom(data.user, data.room, userList => {
                console.log("USERS", userList)
                // 2. then info to everyone to fetch user list
                io.to(data.room).emit(
                    'update-user-list',
                    userList
                );
            });
            
            addMessage({ user: 'Admin', room: data.room, message: 'Welcome to the app' }, (res) => {
                console.log(res)
                // 3. then info to socket with welcome message
                // socket.emit - emits event to single connection(socket)
                socket.emit('new-message', res);
            });
            addMessage({ user: 'Admin', room: data.room, message: `${data.user} has joined` }, (res) => {
                console.log(res)
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
            console.log(res)
            // 1. Info to everyone but the socket to update user list
            // socket.broadcast.emit - emits event to every connection but the socket
            socket.broadcast.to(data.room).emit('new-message', res);
        });

        changeUserRoom(data.user, null, userList => {
            console.log("USERS", userList)
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
