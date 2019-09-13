const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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