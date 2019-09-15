const express = require('express');

const User = require('../db/User');

const router = express.Router();
const os = require('os');

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
    (req, res) => res.send({ user: os.userInfo().username }));

module.exports = router;
