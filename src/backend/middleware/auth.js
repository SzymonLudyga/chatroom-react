const { User } = require('../db/User');
const moment = require('moment')

const authenticate = (req, res, next) => {
    const timestamp = moment().valueOf()
    const token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }
            if (timestamp > user.tokens[user.tokens.length - 1].timestamp) {
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            res.status(401).send(e);
        });
};

module.exports = { authenticate };
