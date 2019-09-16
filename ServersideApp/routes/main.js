
var express = require('express');
var router = express.Router();
var {ensureAuthenticated} = require('../config/auth');


router.get('/main', ensureAuthenticated, (req, res, next) =>{
	res.render('main');
});

module.exports = router;