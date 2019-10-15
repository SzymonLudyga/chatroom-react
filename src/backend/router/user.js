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

    User.findByCredentials(body.name, body.password)
        .then(user => user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        }))
        .catch((err) => {
            res.status(400).send();
        });
});

router.get('/refresh-token', authenticate, (req, res) => {
    console.log("Hejo");
    req.user.removeToken(req.token).then(
        () => {
            req.user
                .save()
                .then(() => req.user.generateAuthToken())
                .then((token) => {
                    res.header('x-auth', token).send(req.user);
                })
                .catch((err) => {
                    res.status(400).send(err);
                });
            
        },
        () => {
            res.status(400).send();
        }
    );
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

router.delete('/token/all', (req, res) => {
    User.findOneAndUpdate({ name: req.body.user }, { tokens: [] }).then(
        (doc) => {
            res.status(200).send(doc);
        },
        (err) => {
            res.status(400).send(err);
        }
    );
});

module.exports = router;
