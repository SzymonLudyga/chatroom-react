/* eslint consistent-return: 0 */
/* eslint no-unused-vars: 0 */

const moment = require('moment');
const { User } = require('../db/User');
const { errorMessages, errorTypes } = require('../utils/errorMessages');

const authenticate = (req, res, next) => {
    const timestamp = moment().valueOf();
    const token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }
            if (timestamp - 3600*1000 > user.tokens[user.tokens.length - 1].timestamp) {
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            res.status(401).send({
                errorType: errorTypes.TOKEN_ERROR,
                errorMessage: errorMessages.tokenInvalid
            });
        });
};

module.exports = { authenticate };
