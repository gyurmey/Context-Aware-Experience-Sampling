var express = require('express');
var router = express.Router();
var Study = require('../../entities/study');

router.get('/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid researcher id");
    }
    var objId= new mongoose.Types.ObjectId(req.params.id);
    Study.count({objId})
    .then(rs=>{
            res.status(200).json(rs);
    })
    .catch(err=>{
        res.status(500).send("Error: " + err.message);
    });
});