var express = require('express');
var router = express.Router();

router.get('/register', function (req, res){
	res.render('register');
});

module.exports = router;