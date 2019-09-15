const express = require('express');

const router = express.Router();

router.get('', (req, res) => res.send({ rooms: [{ id: 1, name: 'oslo' }, { id: 2, name: 'berlin' }, { id: 3, name: 'copenhagen' }] }));

router.post('', (req, res) => res.send(req.body));

module.exports = router;
