const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        minlength: 1,
    },
    room: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    timestamp: {
        type: Number,
        required: true,
        default: null,
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message };
