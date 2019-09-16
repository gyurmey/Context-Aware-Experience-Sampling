
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var str = require('string-to-stream');
var TaskResult = require('../../entities/taskresult').TaskResultModel;
var DtoFactory = require('../../dto/dtofactory');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var ObjectID = require('mongodb').ObjectID;
// var url = "mongodb://proj-m_ss2019:caes%402019@localhost:27017/caes";
var url = "mongodb://localhost:27017/"

//const {ensureAuthenticated} = require('../../config/auth');
//Get list of answers of all user by a specific study ID
/**
 * Exports all results of a study
 * @route GET /admin/result/export/{:id}
 * @param {String} id the id of the study
 * @group Admin/Result - All operations about result in administration page.
 * @returns {File} 200 - JSON file
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/export/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid id");
    }
    TaskResult.getResultByStudyId(req.params.id)
    .then(rs=>{
            if(rs){
                
                res.setHeader('Content-Type', 'application/json');
                var fileName = "Results_" + req.params.id + ".json";
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                var taskResultDto = DtoFactory.taskResultDto(rs);
                str(JSON.stringify(taskResultDto)).pipe(res);
            }
            
    })
    .catch(err=>{
        res.status(500).send(err);
    });
    //var objId = new mongoose.Types.ObjectId(req.params.id);
    // Answer.find({studyId: objId})
    // .then(rs=>{
    //     //res.status(200).json(rs);
    //     res.setHeader('Content-Type', 'application/json');
    //     var fileName = "Results_" + req.params.id + ".json";
    //     res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    //     str(JSON.stringify(rs)).pipe(res);
    // })
    // .catch(err=>{
    //     res.status(500).send(err.message);
    // });
});




/**
 * @GetallResults
 * @route GET /admin/result/

 */
router.get('/', function(req, res){
    console.log('getting all answers');
    TaskResult.find({}).exec(function(err, answers){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(answers);
            res.json(answers);
        }
    });
});

/**
 * @SpecificStepItemResults
 * @route GET /admin/result//tasks/:id/:taskname
 */

router.get('/tasks/:id/:taskname', function(req, res){
    TaskResult.getResultByStudyIdAndName(req.params.id,req.params.taskname)
   .then(rs=>{
   res.render('stepItemResults',{studyId:req.params.id,taskName:req.params.taskname});
    }) 
   .catch(err=>{
        res.send(err);
    })
});

//   console.log('getting one answer');
//   MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("caes");
//         if (err) throw err;
//         res.render('stepItemResults',{studyId:req.params.id,taskName:req.params.taskname});
//         var json=[{"studyId":req.params.id,"taskName":req.params.taskname}];
//           db.close();
//     }); 
// });

router.get('/getOneTask/:id/:taskname', function(req, res){
    TaskResult.getResultByStudyIdAndName(req.params.id,req.params.taskname)
        .then(rs=>{
            res.json(rs);
        })
        .catch(err=>{
            res.send(err);
        })
    });

//   console.log('getting one answer');
//   MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("caes");
//       var query={$and:[{"studyId":req.params.id},{"taskName": req.params.taskname}]}
//       dbo.collection("taskresult").find(query).toArray(function(err, result) {
//         if (err) throw err;
//          res.json(result);
//           db.close();
//       });
//     }); 
// });

/**
 *  @specificStudyCall
 * @route GET /admin/result/tasks/:id/
 */


router.get('/tasks/:id', function(req, res){  
    if(!req.params.id){
                res.status(400).send("Invalid id");
            }
            TaskResult.getResultByStudyId(req.params.id)
            .then(rs=>{
                if(rs){
                    res.json(rs);
                } else{
                    var emptyArray = new Array();
                    res.json(emptyArray);
                }
            })
            .catch(err=>{
                res.status(500).send(err);
            });
        });
        
//     console.log('getting one answer');
//     MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("caes");
//         var query = { studyId: req.params.id};
//         dbo.collection("taskresult").find(query).toArray(function(err, result) {
//           if (err) throw err;
//           console.log(result);
//             res.json(result);
//             db.close();
//         });
//       }); 
// });


// router.get('/:id', function(req, res){
//     console.log('getting one answer');
//     MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("caes");
//         var query = { studyId: req.params.id};
//         dbo.collection("taskresult").find(query).toArray(function(err, result) {
//           if (err) throw err;
//           console.log(result);
//             res.render('statistic',{studyId:req.params.id});
//         });
//       }); 
// });



/**
 *  @allStepResults
 * @route GET /admin/result/AllStepsResults/:id
 */



router.get('/AllStepsResults/:id', function (req, res){
    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query = { _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
         
            res.render('AllStepsResults',{ _id: req.params.id});
            
        });
});
});


router.get('/AllStepsResults/getOneStep/:id', function (req, res){


    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query =  { _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
            res.json(result);
        });
});
});

/**
 *  @allstepitemresults
 *  @route GET admin/result/AllStepsResults/AllStepsItemResults/:id
 */


router.get('/AllStepsResults/AllStepsItemResults/:id', function (req, res){
    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query ={ _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
        
            res.render('AllStepsItemResults',{ _id: new ObjectID(req.params.id)});
            db.close();
        });
});
});


router.get('/AllStepsResults/getOneStep/getOneStepItem/:id', function (req, res){
    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query =  { _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

            res.json(result);
        });
});
});



/**
 *  @AllCoordinate
 *  @route GET admin/result/AllStepsResults/AllStepsItemResults/AllCoordinate/:id
 * 
 */

router.get('/AllStepsResults/AllStepsItemResults/AllCoordinate/:id', function (req, res){
    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query ={ _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
      
            res.render('AllCoordinate',{ _id: new ObjectID(req.params.id)});
            db.close();
        });
});
});


router.get('/AllStepsResults/getOneStep/getOneStepItem/allcoordinate/:id', function (req, res){
    console.log('getting one answer');
    MongoClient.connect(url,{useNewUrlParser:true, uri_decode_auth: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("caes");
        var query =  { _id: new ObjectID(req.params.id)};
        dbo.collection("taskresult").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

            res.json(result);
        });
});
});

/**
 * Get results of a study by id
 * @route GET /admin/result/{:id}
 * @param {String} id the id of a study
 * @group Admin/Result - All operations about result in administration page.
 * @returns {Array} 200 - List of all task results for a study
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid study id");
    }
    TaskResult.getResultByStudyId(req.params.id)
    .then(rs=>{
      res.render('statistic',{studyId:req.params.id});
    })
    .catch(err=>{
        res.status(500).send("Error: " + err);
    });
});


module.exports = router;