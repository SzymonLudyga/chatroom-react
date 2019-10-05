const { User } = require('../db/User');

const getUsers = (room, callback) => {
    User.find({ room }).then(res => {
        callback(res);
    }, err => {
        console.log(err);
    })
};

const changeUserRoom = (user, data) => {
    User.findOneAndUpdate({ name: user }, data).then(res => {
        console.log("RES", res);
    }, err => {
        console.log(err);
    })
};

module.exports = {
    getUsers, changeUserRoom
};