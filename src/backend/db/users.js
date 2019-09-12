const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true
    });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
