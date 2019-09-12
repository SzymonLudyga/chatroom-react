const moment = require('moment');
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

const generateMessage = (from, text) => ({
    from,
    text,
    id: uuidv1(),
    createdAt: moment().format('H:mm')
});

const fetchMessages = () => {
    try {
        const messages = fs.readFileSync(
            path.join(__dirname, '../data', 'messages.json')
        );
        return JSON.parse(messages);
    } catch (e) {
        console.log(e);
        return [];
    }
};

const saveMessages = (data) => {
    fs.writeFileSync(
        path.join(__dirname, '../data', 'messages.json'),
        JSON.stringify(data)
    );
};

const deleteMessages = () => {
    saveMessages([]);
};

const addMessage = (data) => {
    const messages = fetchMessages();
    const message = generateMessage(data.name, data.message);
    messages.push(message);
    saveMessages(messages);
};

module.exports = {
    fetchMessages, addMessage, deleteMessages, saveMessages
};
