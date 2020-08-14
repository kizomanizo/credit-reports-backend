const User = require('../models').User;

exports.getUser = async function(req, res, next) {
    const username = req.body.username ? req.body.username : req.params.userId
    try {
        user = await User.findOne({ where: { username: username } }) ? await User.findOne({ where: { username: username } }) : await User.findOne({ where: {id: req.params.userId} });
        if (user == null) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found',
            })
      }
    }   catch(err){
            return res.status(500).json({ 
                success: false,
                message: err.message,
            })
    }
    res.user = user
    next()
}