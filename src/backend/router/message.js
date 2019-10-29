const express = require('express');

const router = express.Router();

const { Message } = require('../db/Message');
const { authenticate } = require('../middleware/auth');
const { errorMessages, errorTypes } = require('../utils/errorMessages');

const NOT_FOUND = 'NOT_FOUND';

router.delete('/:roomName', authenticate, (req, res) => {
    Message.deleteMany({ room: req.params.roomName }).then((msg) => {
        if (!msg.length) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send('OK');
    }).catch((err) => {
        /* eslint-disable-next-line no-unused-expressions */
        err.message === NOT_FOUND ? res.status(404).send({
            errorType: errorTypes.MESSAGE_ERROR,
            errorMessage:
                `${errorMessages.messagesNotFound}: ${req.params.roomName}.`
        }) : res.status(500).send({
            errorType: errorTypes.MESSAGE_ERROR,
            errorMessage: errorMessages.server
        });
    });
});

router.get('/:roomName', authenticate, (req, res) => {
    Message.find({ room: req.params.roomName }).then((msg) => {
        if (!msg.length) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send(msg);
    }).catch((err) => {
        /* eslint-disable-next-line no-unused-expressions */
        err.message === NOT_FOUND ? res.status(404).send({
            errorType: errorTypes.MESSAGE_ERROR,
            errorMessage:
                `${errorMessages.messagesNotFound}: ${req.params.roomName}.`
        }) : res.status(500).send({
            errorType: errorTypes.MESSAGE_ERROR,
            errorMessage: errorMessages.server
        });
    });
});

module.exports = router;
