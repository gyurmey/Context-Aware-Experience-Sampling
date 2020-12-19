var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/statistic', function (req, res){
	res.render('statistic');
});
router.get('/stepResults', function (req, res){
	res.render('stepResults');
});

// router.get('/steps', function (req, res){
// 	res.render('steps');
// });
router.get('/coordinate', function (req, res){
	res.render('coordinate');
});
router.get('/AllStatistic', function (req, res){
	res.render('AllStatistic');
});
router.get('/AllCoordinate', function (req, res){
	res.render('AllCoordinate');
});
// router.get('/AllStepsItemResults', function (req, res){
// 	res.render('AllStepsItemResults');
// });




module.exports = router;