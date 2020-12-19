
var express = require('express');
var router = express.Router();
//ensureAuthenticated = require('../../config/auth');
//Invite participants to a study
var Study = require('../../entities/study');
/**
 * Adding participant researchers to a study
 * @route PUT /admin/invitation/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about invitation in administration page.
 * @returns {File} 200 - JSON file
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.put('/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid study id");
    }
    Study.addParticipants(req.params.id,req.body.participants)
    .then(rs=>{
        res.status(200).send(rs);
    })  
    .catch(err=>{
        res.status(500);
        res.send(err);
    });
});
/**
 * Adding participant researchers to a study
 * @route GET /admin/invitation/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about invitation in administration page.
 * @returns {Page} 200 - Invitation page
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid id");
    }
    Study.getParticipants(req.params.id)
    .then(rs=>{
        res.render('invitation',{rs:rs, id:req.params.id});
    })
    .catch(err=>{
        res.render("error",err);
    });
});

module.exports = router;