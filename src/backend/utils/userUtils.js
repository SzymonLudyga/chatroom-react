const { User } = require('../db/User');

const getUsers = (room, callback) => {
    User.find({ room }).then(res => {
        callback(res);
    }, err => {
        console.log(err);
    })
};

const changeUserRoom = (user, room) => {
    User.findOneAndUpdate({ name: user }, { room }).then(res => {
        console.log("RES", res);
    }, err => {
        console.log(err);
    })
};

module.exports = {
    getUsers, changeUserRoom
};