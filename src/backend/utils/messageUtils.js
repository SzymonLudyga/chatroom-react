const moment = require('moment');

const { Message } = require('../db/Message');

const addMessage = (data, callback) => {
    const timestamp = moment().valueOf();
    const message = new Message({
        user: data.user, room: data.room, timestamp, message: data.message
    });
    message.save().then(
        (res) => {
            callback(res);
        },
        (err) => {
            throw new Error("Error saving msg");
        }
    );
};

module.exports = {
    addMessage
};