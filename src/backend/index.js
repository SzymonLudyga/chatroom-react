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

// // const wss = new WebSocket.Server({ port: 8080 });
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


// const port = process.env.PORT || 8080;

// app.listen(port, () => console.log(`Listening on port ${port}!`));

const express = require('express');
const moment = require('moment');
const app = express();
const port = 8080;
const os = require('os');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');

const {
    fetchMessages, addMessage, deleteMessages, saveMessages
} = require('./utils/utils');

const { mongoose } = require('./db/mongoose');
const { User } = require('./db/users');
const { Message } = require('./db/messages');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/api/rooms-list', (req, res) => res.send({ rooms: [{ id: 1, name: 'oslo' }, { id: 2, name: 'berlin' }, { id: 3, name: 'copenhagen' }] }));

app.post('/api/room', (req, res) => res.send(req.body));

app.get('/api/username',
    (req, res) => res.send({ username: os.userInfo().username }));

app.delete('/api/messages', (req, res) => {
    deleteMessages();
    res.send({ operation: 'success' });
});

app.get('/api/messages', (req, res) => {
    const messages = fetchMessages();
    console.log(messages);
    res.send({ messages });
});

app.post('/api/users', (req, res) => {
    const user = new User({ name: req.body.name, password: req.body.password });

    user
        .save()
        .then(() => {
            res.send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', (reason) => {
        console.log('user disconnected');
    });

    socket.on('join-room', (data) => {
        console.log('room join');
        console.log(data);
        socket.join(data.room);
    });

    socket.on('leave-room', (data) => {
        console.log('leaving room');
        deleteMessages();
        console.log(data);
        socket.leave(data.room);
    });

    socket.on('create-message', (data) => {
        console.log('DATA', data);
        const timestamp = moment().valueOf();
        User.findOne({ name: data.user }).then(res => {
            const message = new Message({ _user: res._id, room: data.room, timestamp, message: data.message });
            console.log(message);
            message.save().then(
                    res => {
                      io.emit('new-message');
                    },
                    err => {
                      console.log(err)
                    }
                  );
        }, err => {
            console.log(err);
        })
        // const message = new Message({ _user: usetobjectid, room: data.room, timestamp, message: data.message });
        // message.save().then(
        //     res => {
        //       io.emit('new-message');
        //     },
        //     err => {
        //       res.status(400).send(err);
        //     }
        //   );
        addMessage(data);
        // socket.broadcast
        //     .to(data.room)
        //     .emit('receive message', data);
    });
});

server.listen(port, () => {
    console.log(`SERVER ON PORT ${port}`);
});
