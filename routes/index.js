var express = require('express');
var router = express.Router();

/* App Root. */
router.get('/', function(_req, res) {
  res.status(200).send({
      success: true,
      message: 'App root. Nothing to be seen',
  })
})

module.exports = router;
