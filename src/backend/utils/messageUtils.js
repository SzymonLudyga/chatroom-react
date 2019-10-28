const moment = require('moment');

const { Message } = require('../db/Message');
const { errorMessages } = require('./errorMessages');

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
        }
    ).catch((err) => {
        throw new Error(errorMessages.addMessageError);
    });
};

const checkMessage = (data) => {
    if (typeof data.message !== 'string' || data.message.trim() === '') {
        throw new Error(errorMessages.emptyMessage);
    }
};

module.exports = {
    addMessage, checkMessage
};
