const express = require('express');
const _ = require('lodash');

const router = express.Router();

const { User } = require('../db/User');
const { authenticate } = require('../middleware/auth');

router.get('', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/register', (req, res) => {
    const body = _.pick(req.body, ['name', 'password']);
    const user = new User(body);

    user
        .save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post('/login', (req, res) => {
    const body = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(body.name, body.password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user);
            });
        })
        .catch(err => {
            res.status(400).send();
        });
});

router.delete('/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
        () => {
            res.status(200).send();
        },
        () => {
            res.status(400).send();
        }
    );
});

module.exports = router;
