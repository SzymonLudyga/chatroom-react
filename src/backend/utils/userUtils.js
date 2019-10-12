const { User } = require('../db/User');

const getUsers = (room, callback) => {
    User.find({ room }).then((res) => {
        callback(res);
    }, (err) => {
        console.log(err);
    });
};

const checkUserRoom = user => User.findOne({ name: user }).then(res => res.room, (err) => {
    throw new Error('Error getting user');
});

const changeUserRoom = (user, room, callback) => {
    User.findOneAndUpdate({ name: user }, { room })
        .then(res => getUsers(room || res.room, callback))
        .catch(err => console.log(err));
};

module.exports = {
    getUsers, changeUserRoom, checkUserRoom
};
