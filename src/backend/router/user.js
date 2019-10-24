const express = require('express');
const _ = require('lodash');

const router = express.Router();

const { User } = require('../db/User');
const { authenticate } = require('../middleware/auth');
const { errorMessages, errorTypes } = require('../utils/errorMessages');

const NOT_FOUND = 'NOT_FOUND';
const BAD_PASSWORD = 'BAD_PASSWORD';
const VALIDATION_ERROR = 'ValidationError';
const MONGO_ERROR = 'MongoError';

router.get('', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/register', (req, res) => {
    let { name, password } = _.pick(req.body, ['name', 'password']);
    name = name.trim();
    password = password.trim();

    if (password.length < 6) {
        res.status(400).send({
            errorType: errorTypes.USER_ERROR,
            errorMessage: errorMessages.passwordInvalid
        });
    }
    
    const user = new User({ name, password });

    user
        .save()
        .then(() => user.generateAuthToken())
        .then(token => {
            res.header('x-auth', token).send(user);
        }).catch(err => {
            if (err.name === VALIDATION_ERROR) {
                res.status(400).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.usernameInvalid
                });
            } else if (err.name === MONGO_ERROR && err.code === 11000) {
                res.status(422).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.userExists
                });
            } else {
                res.status(500).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.server
                });
            }
        });
});

router.post('/login', (req, res) => {
    const { name, password } = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(name, password)
        .then(user => user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        }))
        .catch(err => {
            if (err === NOT_FOUND) {
                res.status(404).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.userNotFound
                });
            } else if (err === BAD_PASSWORD) {
                res.status(401).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.incorrectPassword
                });
            } else {
                res.status(500).send({
                    errorType: errorTypes.USER_ERROR,
                    errorMessage: errorMessages.server
                });
            }
        });
});

router.get('/refresh-token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        req.user
            .save()
            .then(() => req.user.generateAuthToken())
            .then((token) => {
                res.header('x-auth', token).send(req.user);
            })
    }).catch(err => {
        res.status(500).send({
            errorType: errorTypes.USER_ERROR,
            errorMessage: errorMessages.server
        });
    });
});

router.delete('/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send(req.user);
    }).catch(err => {
        res.status(500).send({
            errorType: errorTypes.USER_ERROR,
            errorMessage: errorMessages.server
        });
    });
});

router.delete('/token/all', (req, res) => {
    const { user } = req.body;

    User.findOneAndUpdate({ name: user }, { tokens: [] }).then(user => {
        if (!user) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send(user);
    }).catch(err => {
        err.message === NOT_FOUND ?
        res.status(404).send({
            errorType: errorTypes.USER_ERROR,
            errorMessage: errorMessages.userNotFound
        }) : 
        res.status(500).send({
            errorType: errorTypes.USER_ERROR,
            errorMessage: errorMessages.server
        })
    });
});

module.exports = router;
