const express = require('express');
const moment = require('moment');

const { Room } = require('../db/Room');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('', (req, res) => {
    Room.find().then(
        rooms => res.status(200).send(rooms)
    ).catch(err => res.status(404).send(err));
});

router.delete('', (req, res) => {
    console.log(req.body)
    Room.findOneAndRemove({ name: req.body.room }).then((room) => {
        res.status(200).send(room);
    }, (err) => {
        res.send(err);
    });
});

router.post('', (req, res) => {
    const created_at = moment().valueOf();
    const room = new Room({ name: req.body.room.toLowerCase(), created_at, creator: req.body.user });

    Room.find().then(
        rooms => {
            if (rooms.length > 10) {
                throw new Error('There are too many rooms created');
            }
        }
    ).catch(err => {
        res.status(422).send({
            errorType: 'room',
            errorMessage: err.message
        });
    });

    room
        .save()
        .then(doc => 
            res.status(200).send(doc)
        ).catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                res.status(400).send({
                    errorType: 'room',
                    errorMessage: `Room must contain 4-20 letters.`
                });
            } else if (err.name === 'MongoError' && err.code === 11000) {
                res.status(422).send({
                    errorType: 'room',
                    errorMessage: 'Room already exists.'
                });
            } else {
                res.status(500).send({
                    errorType: 'room',
                    errorMessage: 'Unknown error, check your internet connection.'
                });
            }
        });
});

router.post('/choose', (req, res) => res.send(req.body));

module.exports = router;
