var express = require('express');
var router = express.Router();
var TaskResult = require('../../entities/taskresult').TaskResultModel;
/**
 * Submit answers of a study
 * @route POST
 * @group API/answer - All API operations about answers submission
 * @returns {String} 200 - Message
 * @returns {Error}  default - Unexpected error
 */

router.post('/',function(req,res){
    TaskResult.insertResult(req.body)
    .then(rs=>{
        res.status(200).send("Answer has been submitted");
    })
    .catch(err=>{
        res.status(500).send("Error : " + err);
    });
});

module.exports = router;