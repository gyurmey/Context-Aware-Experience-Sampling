
var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, function (req, res, next) {
  res.render('login');
});
router.get('/main', ensureAuthenticated,  function (req, res, next) {
  res.render('main', {  user: req.user });
});
module.exports = router;
