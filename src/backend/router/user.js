const express = require('express');


const _ = require('lodash');

const router = express.Router();
const os = require('os');
const { User } = require('../db/User');

router.post('', (req, res) => {
    const user = new User({ name: req.body.name, password: req.body.password });

    user
        .save()
        .then(() => {
            res.send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.get('',
    (req, res) => {
        User.find().then(user => res.send({ user })).catch(err => res.status(404).send('User not found'));
        // res.send({ user: os.userInfo().username })
    });

router.post('/register', (req, res) => {
    const body = _.pick(req.body, ['name', 'password']);
    const user = new User(body);

    user
        .save()
        .then(() => user.generateAuthToken())
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.post('/login', (req, res) => {
    const body = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(body.email, body.password)
        .then(user => user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        }))
        .catch((err) => {
            res.status(400).send();
        });
});

module.exports = router;
