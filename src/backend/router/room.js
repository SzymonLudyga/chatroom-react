const express = require('express');
const moment = require('moment');

const { Room } = require('../db/Room');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('', (req, res) => {
    Room.find().then(rooms => {
        if (!rooms.length) {
            throw new Error('not-found');
        }
        res.status(200).send(rooms)
    }).catch(err => {
        err.message === 'not-found' ?
        res.status(404).send({
            errorType: 'room-error',
            errorMessage: 'No rooms fetched.'
        }) :
        res.status(500).send({
            errorType: 'room-error',
            errorMessage: 'Server error'
        });
    });
});

router.delete('', authenticate, (req, res) => {
    Room.findOneAndRemove({ room: req.body.room }).then(room => {
        if (!room) {
            throw new Error('not-found')
        }
        res.status(200).send(room)
    }).catch(err => {
        err.message === 'not-found' ?
        res.status(404).send({
            errorType: 'room-error',
            errorMessage: 'Error deleting the room: Room not found.'
        }) :
        res.status(500).send({
            errorType: 'room-error',
            errorMessage: 'Server error'
        });
    });
});

router.post('', authenticate, (req, res) => {
    const created_at = moment().valueOf();
    const room = new Room({ name: req.body.room.toLowerCase(), created_at, creator: req.body.user });

    Room.find().then(
        rooms => {
            if (rooms.length > 10) {
                throw new Error('forbidden-action');
            }
        }
    ).catch(err => {
        err.message === 'forbidden-action' ?
        res.status(422).send({
            errorType: 'create-room',
            errorMessage: 'Too many rooms created. Choose one from the list.'
        }) :
        res.status(500).send({
            errorType: 'create-room',
            errorMessage: 'Unknown error, check your internet connection.'
        });
    });

    room
        .save()
        .then(newRoom =>
            res.status(200).send(newRoom)
        ).catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                res.status(400).send({
                    errorType: 'create-room',
                    errorMessage: `Room must contain 4-20 letters.`
                });
            } else if (err.name === 'MongoError' && err.code === 11000) {
                res.status(422).send({
                    errorType: 'create-room',
                    errorMessage: 'Room already exists.'
                });
            } else {
                res.status(500).send({
                    errorType: 'create-room',
                    errorMessage: 'Unknown error, check your internet connection.'
                });
            }
        });
});

router.post('/join', authenticate, (req, res) => {
    Room.findOne({ name: req.body.room }).then(room => {
        if (!room) {
            throw new Error('not-found')
        }
        res.status(200).send(room.name)
    }).catch(err => {
        err.message === 'not-found' ?
        res.status(404).send({ 
            errorType: 'room-error',
            errorMessage: 'Error joining the room: Room not found.'
        }) :
        res.status(500).send({ 
            errorType: 'room-error',
            errorMessage: 'Server Error'
        });
    });
});

module.exports = router;
