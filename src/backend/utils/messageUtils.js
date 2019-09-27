const moment = require('moment');

const { Message } = require('../db/Message');

const addMessage = (data) => {
    const timestamp = moment().valueOf();
    const message = new Message({
        user: data.user, room: data.room, timestamp, message: data.message
    });
    message.save().then(
        (res) => {
            return 'msg-saved';
        },
        (err) => {
            throw new Error("error saving msg");
        }
    );
};

module.exports = {
    addMessage
};