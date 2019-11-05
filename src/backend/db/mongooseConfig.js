const mongoose = require('mongoose');

require('dotenv').config();

const dbUrl = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true });

module.exports = { mongoose };
