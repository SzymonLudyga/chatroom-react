const express = require('express');

const router = express.Router();

const {
    fetchMessages, addMessage, deleteMessages, saveMessages
} = require('../utils/utils');

router.delete('', (req, res) => {
    deleteMessages();
    res.send({ operation: 'success' });
});

router.get('', (req, res) => {
    const messages = fetchMessages();
    console.log('MESSAGES', messages);
    res.send({ messages });
});

module.exports = router;
