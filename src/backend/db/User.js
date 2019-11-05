/* eslint func-names: 0 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const NOT_FOUND = 'NOT_FOUND';
const BAD_PASSWORD = 'BAD_PASSWORD';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        default: null
    },
    socket_id: {
        type: String,
        default: null
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            },
            timestamp: {
                type: Number,
                required: true,
                default: null,
            }
        }
    ]
});

UserSchema.methods.generateAuthToken = function () {
    const expiration = moment().add(1, 'hours').valueOf();
    const user = this;
    const access = 'auth';
    const token = jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();
    user.tokens = user.tokens.concat([{
        access, token, timestamp: expiration
    }]);
    return user.save().then(() => token);
};

UserSchema.statics.findByCredentials = function (name, password) {
    const User = this;

    return User.findOne({ name }).then((user) => {
        if (!user) {
            return Promise.reject(NOT_FOUND);
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject(BAD_PASSWORD);
                }
            });
        });
    });
};

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
