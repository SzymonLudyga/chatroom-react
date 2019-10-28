const express = require('express');
const moment = require('moment');

const router = express.Router();

const { Room } = require('../db/Room');
const { authenticate } = require('../middleware/auth');
const { errorMessages, errorTypes } = require('../utils/errorMessages');

const NOT_FOUND = 'NOT_FOUND';
const FORBIDDEN = 'FORBIDDEN_ACTION';
const VALIDATION_ERROR = 'ValidationError';
const MONGO_ERROR = 'MongoError';

router.get('', (req, res) => {
    Room.find().then((rooms) => {
        if (!rooms.length) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send(rooms);
    }).catch((err) => {
        err.message === NOT_FOUND
            ? res.status(404).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.roomsNotFound
            })
            : res.status(500).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.server
            });
    });
});

router.delete('', authenticate, (req, res) => {
    Room.findOneAndRemove({ name: req.body.room }).then((room) => {
        if (!room) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send(room);
    }).catch((err) => {
        err.message === NOT_FOUND
            ? res.status(404).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.roomToDeleteNotFound
            })
            : res.status(500).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.server
            });
    });
});

router.post('', authenticate, (req, res) => {
    const created_at = moment().valueOf();
    const room = new Room({ name: req.body.room.toLowerCase(), created_at, creator: req.body.user });

    Room.find().then(
        (rooms) => {
            if (rooms.length > 10) {
                throw new Error(FORBIDDEN);
            }
        }
    ).catch((err) => {
        err.message === FORBIDDEN
            ? res.status(422).send({
                errorType: errorTypes.CREATE_ERROR,
                errorMessage: errorMessages.roomsNumberExceeded
            })
            : res.status(500).send({
                errorType: errorTypes.CREATE_ERROR,
                errorMessage: errorMessages.server
            });
    });

    room
        .save()
        .then(newRoom => res.status(200).send(newRoom)).catch((err) => {
            console.log(err);
            if (err.name === VALIDATION_ERROR) {
                res.status(400).send({
                    errorType: errorTypes.CREATE_ERROR,
                    errorMessage: errorMessages.roomValidationError
                });
            } else if (err.name === MONGO_ERROR && err.code === 11000) {
                res.status(422).send({
                    errorType: errorTypes.CREATE_ERROR,
                    errorMessage: errorMessages.roomExists
                });
            } else {
                res.status(500).send({
                    errorType: errorTypes.CREATE_ERROR,
                    errorMessage: errorMessages.server
                });
            }
        });
});

router.post('/join', authenticate, (req, res) => {
    Room.findOne({ name: req.body.room }).then((room) => {
        if (!room) {
            throw new Error(NOT_FOUND);
        }
        res.status(200).send(room.name);
    }).catch((err) => {
        err.message === NOT_FOUND
            ? res.status(404).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.roomToJoinNotFound
            })
            : res.status(500).send({
                errorType: errorTypes.ROOM_ERROR,
                errorMessage: errorMessages.server
            });
    });
});

module.exports = router;
