const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const variables = require('../config/variables');
const ms = require('ms');
const tokenExpiry = new Date (Date.now() + ms(variables.expiration));

// Get specific user details from the database
exports.details = function(req, res) {
    try {
        res.status(200).json({
            success: true,
            message: res.user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Creating new entries in the persistence mechanism
exports.create = function(req, res) {
    const saltRounds = 11;
    const plainPassword = req.body.password;
    const joinDate = req.body.joinDate;
    // Generate salt, note the number of rounds to be saved later
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plainPassword, salt, async function(err, hash) {
            // Storing the user object in the database.
            const user = new User({
                username: req.body.username,
                password: hash,
                salt: salt,
                saltRounds: saltRounds,
                lastLogin: null,
                tokenExpiry: null,
                status: 0,
                joinDate: new Date(joinDate),
                createdBy: 1,
                createdAt: new Date(),
            })
            try {
                const newUser = await user.save()
                res.status(201).json({
                    success: true,
                    message: newUser,
                })
            } catch (err) {
                res.status(400).json({
                    success: false,
                    message: err.message,
                })
            }
        });
    });
}

// Login logic lies here
exports.login = async function(req, res) {
    try {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            let token = jwt.sign({username: req.body.username},
                variables.secret, {
                    expiresIn: variables.expiration, // it can be 1m, 2h, 60d, 1y, 6000(1 minute), etc.
                });
            res.user.tokenExpiry = tokenExpiry;
            res.user.lastLogin = new Date();
            res.user.save();
            res.json({
                success: true,
                message: 'Authentication successful!',
                token: token,
                expiry: tokenExpiry,
                // user: user,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Incorrect email or password'
            })
        }
    } catch(err) {
        res.status(401).send({
            success: false,
            message: err.message,
            // password: user.password,
            // username: user.username,
        })
    }
}

// Update specific user details
exports.update = async function (req, res) {
    // Post the update datetime now
    res.user.updatedAt = Date()
    if (req.body.username != null) {
        res.user.username = req.body.username
    }
    if (req.body.status != null) {
        res.user.status = req.body.status
    }
    if (req.body.joinDate != null) {
        res.user.joinDate = req.body.joinDate
    }

    // Hash the posted pasword if sent and store its parameters
    if (req.body.password != null) {
        const saltRounds = 11;
        const plainPassword = req.body.password;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(plainPassword, salt);
        res.user.password = hash
        res.user.salt = salt
        res.user.saltRounds = saltRounds
    }

    try {
        const updatedUser = await res.user.save()
        res.status(200).json({
            success: true,
            message: updatedUser,
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}

// Delete one user
exports.delete = async function (req, res) {
    try {
        await res.user.destroy()
        res.status(200).json({ 
            success: true,
            message: 'User has been deleted',
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.me = async function (req, res) {
    const user = await User.findOne({ where: { username: req.decoded.username }, attributes: ['id', 'username', 'lastLogin', 'tokenExpiry', 'status', 'createdAt', 'updatedAt'] })
    try {
        res.status(200).json({ 
            success: true,
            user: user,
        })
    } catch (err) {
        console.log(err)
    }
}

// Logout the user form the system
exports.logout = function(_req, res) {
    try {
        res.status(200).json({
            success: true,
            message: "User has logged out!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}