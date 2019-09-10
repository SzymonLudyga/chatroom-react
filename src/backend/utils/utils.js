const moment = require('moment');
const fs = require('fs');
const path = require('path');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().format('D MMM YYYY H:mm')
    };
};

const fetchMessages = () => {
    try {
        const messages = fs.readFileSync(
            path.join(__dirname, "../data", `messages.json`)
        );
        return JSON.parse(messages);
    } catch (e) {
        console.log(e);
        return [];
    }
};

const saveMessages = (data) => {
    fs.writeFileSync(
        path.join(__dirname, "../data", `messages.json`),
        JSON.stringify(data)
    );
};

const deleteMessages = () => {
    saveMessages([]);
};

const addMessage = (data) => {
    let messages = fetchMessages();
    const message = generateMessage(data.name, data.message);
    messages.push(message);
    saveMessages(messages);
};

module.exports = {
    fetchMessages, addMessage, deleteMessages, saveMessages
};
