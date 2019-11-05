const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { Message } = require('../../db/Message');
const { User } = require('../../db/User');
const { Room } = require('../../db/Room');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();
const firstTimestamp = moment().valueOf();
const timestamps = [
    firstTimestamp - 10,
    firstTimestamp,
    firstTimestamp + 10,
    firstTimestamp + 20
];

const roomsDummy = [
    {
        _id: new ObjectId(),
        name: 'oslo',
        created_at: timestamps[0],
        creator: 'firstUser'
    },
    {
        _id: new ObjectId(),
        name: 'tokio',
        created_at: timestamps[0],
        creator: 'secondUser'
    }
];

const usersDummy = [
    {
        _id: userOneId,
        name: 'firstUser',
        password: 'userPass1',
        socket_id: 'gfdgdfidassadasdasdgas',
        room: roomsDummy[0].name,
        tokens: [
            {
                access: 'auth',
                token: jwt.sign(
                    {
                        _id: userOneId, access: 'auth'
                    },
                    process.env.JWT_SECRET
                ).toString(),
                timestamp: timestamps[0]
            }
        ]
    },
    {
        _id: userTwoId,
        name: 'secondUser',
        password: 'userNotPass2',
        socket_id: 'ksadidassdsdasdasdgas',
        room: roomsDummy[0].name,
        tokens: [
            {
                access: 'auth',
                token: jwt.sign(
                    {
                        _id: userTwoId, access: 'auth'
                    },
                    process.env.JWT_SECRET
                ).toString(),
                timestamp: timestamps[0]
            }
        ]
    },
    {
        _id: userThreeId,
        name: 'thirdUser',
        password: 'userPass3',
        socket_id: 'idasdlsadfsdfsdgas',
        room: roomsDummy[1].name,
        tokens: [
            {
                access: 'auth',
                token: jwt.sign(
                    {
                        _id: userThreeId, access: 'auth'
                    },
                    process.env.JWT_SECRET
                ).toString(),
                timestamp: timestamps[0]
            }
        ]
    }
];

const messagesDummy = [
    {
        _id: new ObjectId(),
        message: 'First test message',
        socket_id: 'idasdvasdvvdgas',
        timestamp: timestamps[1],
        user: usersDummy[0].name,
        room: roomsDummy[0].name
    },
    {
        _id: new ObjectId(),
        message: 'Second test message',
        socket_id: 'iusafasyfvbahfbash',
        timestamp: timestamps[2],
        user: usersDummy[0].name,
        room: roomsDummy[1].name
    },
    {
        _id: new ObjectId(),
        message: 'Third test message',
        timestamp: timestamps[3],
        user: usersDummy[1].name,
        room: roomsDummy[0].name
    }
];

const populateMessages = (done) => {
    Message.deleteMany({})
        .then(() => Message.insertMany(messagesDummy))
        .then(() => done());
};

const populateRooms = (done) => {
    Room.deleteMany({})
        .then(() => Room.insertMany(roomsDummy))
        .then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({})
        .then(() => {
            const userOne = new User(usersDummy[0]).save();
            const userTwo = new User(usersDummy[1]).save();
            const userThree = new User(usersDummy[2]).save();
            return Promise.all([userOne, userTwo, userThree]);
        })
        .then(() => done());
};

module.exports = {
    roomsDummy,
    messagesDummy,
    usersDummy,
    populateMessages,
    populateRooms,
    populateUsers
};
