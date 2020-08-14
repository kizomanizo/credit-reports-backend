const jwt = require('jsonwebtoken');
const config = require('../config/variables');

const checkToken = (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // express induced lowercase kumbuka
        if (token.startsWith('Bearer ')) {
            // plucking the bearer from the string kama ipo
            token = token.slice(7, token.length);
        }
      
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
    };   

module.exports = {
    checkToken: checkToken
}