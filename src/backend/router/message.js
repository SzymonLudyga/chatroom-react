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

router.get('', (req, res) => {
    Message.find().then(msg => {
        console.log('MESSAGES', msg);
        res.status(200).send({ msg })
    }, err => {
        res.send(err);
    });
});

module.exports = router;
