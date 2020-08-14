var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const middlewareUser = require('../middlewares/getUser');
const middlewareToken = require('../middlewares/checktoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', middlewareUser.getUser, userController.login);
router.post('/add', middlewareToken.checkToken, userController.create);
router.post('/register', userController.create); // Temporary Initial route for creating first admin @todo disable on Prod
router.get('/:userId', middlewareToken.checkToken, middlewareUser.getUser, userController.details);
router.patch('/:userId', middlewareToken.checkToken, middlewareUser.getUser, userController.update);
router.delete('/:userId', middlewareToken.checkToken, middlewareUser.getUser, userController.delete);
router.get('/me/details', middlewareToken.checkToken, userController.me);

module.exports = router;