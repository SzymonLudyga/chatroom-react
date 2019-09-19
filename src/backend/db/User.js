const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                require: true
            },
            token: {
                type: String,
                require: true
            }
        }
    ]
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => token);
};

UserSchema.statics.findByCredentials = function (name, password) {
    const User = this;

    return User.findOne({ name }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
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
