
var express = require('express');
var router = express.Router();
var Study = require('../entities/study');
const {ensureAuthenticated} = require('../config/auth');
var mongoose = require('mongoose');
router.get('/editor',ensureAuthenticated, function (req, res){
    var objId = new mongoose.Types.ObjectId(req.user._id);  
	Study.find({ $or:[ {'researcher':objId}, {'participantResearchers':objId}]})
    .then(rs=>{
        res.status(200);
		res.render('editor',{
			studies: rs
		 })
	})
    .catch(err=>{
        res.status(500);
        res.send("Error: " + err.message);
	})
});
router.get('/addstudy', function (req, res) {
    res.render('addStudy');
});

module.exports = router;