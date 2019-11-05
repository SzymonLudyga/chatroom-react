const mongoose = require('mongoose');

require('dotenv').config();

const db_url = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL

mongoose.connect(db_url, { useNewUrlParser: true });

module.exports = { mongoose };
