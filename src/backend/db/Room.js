const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, 'Please fill a valid room name']
    },
    created_at: {
        type: Number,
        required: true,
        default: null,
    },
    creator: {
        type: String,
        required: true,
        minlength: 1,
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };
