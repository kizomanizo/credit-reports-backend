require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION
};