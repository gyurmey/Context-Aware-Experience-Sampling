
var express = require('express');
var router = express.Router();
var ConfirmedConsent = require('../../entities/confirmedconsent');
var mongoose = require('mongoose');
//Submit cofirming a consent of a study
router.post('/',function(req,res){
    ConfirmedConsent.create(req.body)
    .then(rs=>{
        res.status(201).send("Consent submitted");    
    })
    .catch(err=>{
        res.status(500).send(err.message);
    });
});
//Check whether Android user submitted a consent for a specific study or not
router.get('/confirm/:studyid/:userid',function(req,res){

    if(!req.params.studyid){
        res.status(400).send("Study id is required");
    }
    if(!req.params.userid){
        res.status(400).send("User id is required");
    }

    ConfirmedConsent.findOne({userId:  req.params.userid,studyId:req.params.studyid})
    .then(rs=>{
        if(rs){
            res.status(200).send(true);
        } else{
            res.status(200).send(false);
        }
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});
module.exports = router;