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

router.post('', (req, res) => {
    const created_at = moment().valueOf();
    const room = new Room({ name: req.body.room, created_at, creator: req.body.user });

    room
        .save()
        .then(doc => 
            res.status(200).send(doc)
        ).catch(err => 
            res.status(400).send({
                errorType: 'room',
                errorMessage: 'Try other room name'
            })
        );
});

router.post('/choose', (req, res) => res.send(req.body));

module.exports = router;
