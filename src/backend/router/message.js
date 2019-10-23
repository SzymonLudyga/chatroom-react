const express = require('express');

const router = express.Router();

const { Message } = require('../db/Message');
const { authenticate } = require('../middleware/auth');

router.delete('/:roomName', authenticate, (req, res) => {
    Message.deleteMany({ name: req.params.roomName }).then(msg => {
        if (!msg.length) {
            throw new Error('not-found')
        }
        res.status(200).send('OK');
    }).catch(err => {
        err.message ===  'not-found' ?
        res.status(404).send({
            errorType: 'message-error',
            errorMessage: `No messages to delete for the room: ${req.params.roomName}.`
        }) :
        res.status(500).send({
            errorType: 'message-error',
            errorMessage: 'Server error'
        });
    });
});

router.get('/:roomName', authenticate, (req, res) => {
    Message.find({ room: req.params.roomName }).then(msg => {
        if (!msg.length) {
            throw new Error('not-found')
        }
        res.status(200).send(msg);
    }).catch(err => {
        err.message ===  'not-found' ?
        res.status(404).send({
            errorType: 'message-error',
            errorMessage: `Messages not found for the room: ${req.params.roomName}.`
        }) :
        res.status(500).send({
            errorType: 'message-error',
            errorMessage: 'Server error'
        });
    });
});

module.exports = router;
