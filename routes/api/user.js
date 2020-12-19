var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../../entities/user').UserModel;
var uuidv4 = require('uuid/v4');

/**
 * Create new user information when user access application in the first time
 * @route POST /api/user/
 * @group Users - All operations about users
 * @returns {id} 200 - The id of the user
 * @returns {Error}  default - Unexpected error
 */
// function middleware(req,res,next){
//     console.log("Middleware invoked");
//     next();
// }
router.post('/',function(req,res){
    //console.log("User POST invoked");
    var generate = uuidv4();
    generate = generate.replace('-','');
    User.create({token:generate})
    .then(rs =>{
        res.status(200);
        res.json({userId:rs._id});
    })
    .catch(err=>{
        res.status(500);
        res.send("Error: " +err.message);
    });
});

module.exports = router;