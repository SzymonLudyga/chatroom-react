const express = require('express');

const router = express.Router();

const { Message } = require('../db/Message');
const { authenticate } = require('../middleware/auth');

router.delete('', (req, res) => {
    Message.deleteMany().then(doc => {
        res.status(200).send('OK');
    }, err => {
        res.send(err);
    });
});

router.get('/:roomName', (req, res) => {
    Message.find({room: req.params.roomName}).then(msg => {
        res.status(200).send({ msg })
    }, err => {
        res.send(err);
    });
});

module.exports = router;
