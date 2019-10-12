const moment = require('moment');

const { Message } = require('../db/Message');

const addMessage = (data, callback) => {
    const timestamp = moment().valueOf();
    const message = new Message({
        user: data.user, room: data.room, timestamp, message: data.message
    });
    message.save().then(
        (res) => {
            callback({
                user: res.user,
                timestamp: res.timestamp,
                message: res.message
            });
        },
        (err) => {
            throw new Error('Error saving msg');
        }
    );
};

const checkMessage = (data) => {
    if (!data.message) {
        throw new Error('Message should be non-empty');
    }
};

module.exports = {
    addMessage, checkMessage
};
