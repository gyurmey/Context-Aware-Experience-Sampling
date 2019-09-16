var express = require('express');
var router = express.Router();
var Study = require('../../entities/study');
var qr = require('qr-image');
var str = require('string-to-stream');
var TaskResult = require('../../entities/taskresult').TaskResultModel;
var DtoFactory = require('../../dto/dtofactory');
/**
 * Insert a new study to database.
 * @route POST /admin/study/
 * @group Admin/Study - All operations about study in administration page.
 * @returns {study} 200 - The json string of the inserted study
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.post('/',function(req,res){
    // if(!req.isAuthenticated()){
    //     res.status(401).send("Unauthenticated request. Please login before sumitting");
    // }
    if(!req.body){
        res.status(400).send("No study Json string were received");
    }

    try{
        validateStudy(req.body);
    }
     catch(error){
        res.status(400).send("Error: " + error.message);
     }
     //console.log(req.body.triggers[0]);
     var toBeAdded = req.body;
     if(req.user){
        if(req.user._id){
            toBeAdded.researcher = req.user._id;
        }
     }
    Study.createstudy(toBeAdded)
    .then(rs => {
        res.status(200).send(rs);
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});

// //Validate study string before inserting

function validateStudy(study){
    if(!study.name.trim()){
        throw new Error("Study must have identifier");
    }
    if(!study.hasOwnProperty("tasks")){
        throw new Error("Study must have at least one task");
    }
    if(!Array.isArray(study.tasks) || !study.tasks.length){
        throw new Error("A study must have at least one task");
    }
    study.tasks.forEach(function(task){
        if(!Array.isArray(task.steps) || !task.steps.length){
            throw new Error("A task must have at least one question step");
        }
    });
}

// //Populate all current study
/**
 * Get all studies of a researcher
 * @route GET /admin/study/
 * @group Admin/Study - All operations about study in administration page.
 * @returns {Array} 200 - List of all studies of logged account
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
const {ensureAuthenticated} = require('../../config/auth');
router.get('/',ensureAuthenticated,function(req,res,next){
    var objId = new mongoose.Types.ObjectId(req.user._id);
    Study.find({ $or:[ {'researcher':objId}, {'participantResearchers':objId}]})
    .then(rs=>{
        if(!rs){
            var emptyArray = new Array();
            res.status(200).json(emptyArray);
        } else{
            res.status(200);
            res.json(rs);
        }
        
    })
    .catch(err=>{
        res.status(500);
        res.send("Error: " + err);
    });
});

// //Get study by id
/**
 * Get study by id
 * @route GET /admin/study/get-by-id/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {Study} 200 - The found study
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/get-by-id/:id',function(req,res){
    if(!req.params.id){
        res.status(400);
        res.send("Invalid id of study");
    }
    Study.findStudyById(req.params.id)
    .then(rs => {
        if(!rs){
            res.status(200).json({});
        } else{
            res.status(200);
            res.json(rs);
        }
        
    })
    .catch(err =>{
        res.status(500);
        res.send("Error: " + err);
    });
});

// //Update a study given by id and a JSON string of study
/**
 * Get study by id
 * @route PUT /admin/study/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {Study} 200 - Updated study
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.put('/:id',function(req,res){

    if(!req.params.id){
        res.status(400);
        res.send("Invalid id of study");
    }
    Study.updateStudy(req.params.id,req.body)
    .then(rs =>{
        if(!rs){
            res.status(200).json({});
        } else{
            res.status(200);
            res.send(rs);
        }
        
    })
    .catch(err => {
        res.status(500);
        res.send("Error: " + err);
    });
});

//Delete a study
/**
 * Delete a study by id
 * @route DELETE /admin/study/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {Study} 200 - Deleted
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.delete('/:id',function(req,res){
    if(!req.params.id){
        res.status(400);
        res.send("Invalid id of study");
    }
    Study.deleteStudy(req.params.id)
    .then(rs=>{
        res.status(200).send(rs);
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});

// //Confirm a study
/**
 * Confirm study not to be modified in the future
 * @route PUT /admin/study/confirm/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {Study} 200 - Confirmed
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.put('/confirm/:id',function(req,res){
    if(!req.params.id){
        res.status(400);
        res.send("Invalid id of study");
    }
    Study.confirmStudy(req.params.id)
    .then(rs=>{
        res.status(200).send(rs);
    })
    .catch(err=>{
        res.status(500).send("Error when confirming study: " + err);
    });
});

function parsetoShortStudyDtos(studiesList,listStudyDtos){
    var listPromises = new Array();
    studiesList.forEach(function(study){
            listPromises.push(new Promise(function(resolve,reject){
                var dto = DtoFactory.toStudyDtoShortSchema(
                    study._id,
                    study.name,
                    study.description,
                    study.earliestBeginOfDataGathering,
                    study.latestBeginOfDataGathering,
                    study.minimumStudyDurationPerPerson,
                    study.maximumStudyDurationPerPerson,
                    study.tasks);
                listStudyDtos.push(dto);
                resolve("Added");
            }));
    });
    return Promise.all(listPromises);
}
function loadTaskResultsForStudies(listStudyDtos,listPairStudyResult){
    var listPromises = new Array();
    listStudyDtos.forEach(function(studyDto){
        listPromises.push(new Promise(function(resolve,reject){
            TaskResult.getResultByStudyId(studyDto._id)
        .then(rs=>{
            if(!rs){
                var emptyArray = new Array();
                var pair= DtoFactory.fullStudyData(studyDto,emptyArray);
                listPairStudyResult.push(pair);
                resolve("Pair created");
            } else{
                var pair= DtoFactory.fullStudyData(studyDto,rs);
                listPairStudyResult.push(pair);
                resolve("Pair created");
            }
            
        })
        .catch(err=>{
            reject("Error when getting task result");
            });
        }));
    });
    return Promise.all(listPromises);
}

/**
 * Exports all study-taskresult pairs that only available for the current logged in researcher
 * @route GET /admin/study/export
 * @group Admin/Study - All operations about study in administration page.
 * @returns {File} 200 - JSON file
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/export',ensureAuthenticated,function(req,res,next){
        if(!req.user._id){
            res.status(400).send("Please login with your account");
        }
        Study.getStudiesByResearcherId(req.user._id)
        .then(studies=>{
            
            var listStudyDtos = new Array();
            parsetoShortStudyDtos(studies,listStudyDtos)
            .then(rs=>{
                var listPairStudyResult = new Array();
                loadTaskResultsForStudies(listStudyDtos,listPairStudyResult)
                .then(rs=>{
                    //res.json(listPairStudyResult);
                        res.setHeader('Content-Type', 'application/json');
                        var fileName = "Study_" + req.user.email + ".json";
                        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                        str(JSON.stringify(listPairStudyResult)).pipe(res);
                })
                .catch(err=>{
                    res.status(500).send("Error when exporting data: " + err);
                });
            })
            .catch(err=>{
                res.status(500).send("Error when exporting data: " + err);
            });
            
        })
        .catch(err=>{
            res.status(500).send(err);
        });
});
/**
 * Exports study by id
 * @route GET /admin/study/export-study/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {File} 200 - JSON file
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/export-study/:id',function(req,res){
    if(!req.params.id){
        res.status(400).send("Invalid study id");
    }
    Study.findStudyById(req.params.id)
    .then(study=>{
        if(study){
            TaskResult.getResultByStudyId(req.params.id)
            .then(taskresults=>{
                var shortStudyDto = DtoFactory.toStudyDtoShortSchema(study._id,
                    study.name,
                    study.description,
                    study.tasks);
                var dataObject = DtoFactory.fullStudyData(shortStudyDto,taskresults);
                res.setHeader('Content-Type', 'application/json');
                var fileName = "StudyFULL_" + req.params.id + ".json";
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                str(JSON.stringify(dataObject)).pipe(res);
            })
            .catch(err=>{
                res.status(500).send("Error when loading result " + err);
            });
        }
    })
    .catch(err=>{
        res.status(500).send("Error when loading study data " + err);
    })
    
});

//Generate QR image
/**
 * Get the QR code of a study
 * @route GET /admin/study/export-study/{:id}
 * @param {String} id the id of a study
 * @group Admin/Study - All operations about study in administration page.
 * @returns {File} 200 - PDF QR-Code file
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
router.get('/qr/:id',function(req,res){
    if(!req.params.id){
        res.status(400);
        res.send("Invalid id of study");
    }
    Study.findById(req.params.id)
    .then(rs =>{
        if(rs){
            var fullURL = req.protocol + "://" + req.get('host') + "/api/study/" + req.params.id;
            var qr_png = qr.image(fullURL, { type: 'pdf' });
            res.setHeader('Content-Type', 'application/pdf');
            var fileName = "StudyQRCode_" + req.params.id + ".pdf";
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            qr_png.pipe(res);
        } else{
                res.status(404).send("Unknown study");
        }
    })
    .catch(err=>{
            res.status(500).send("Error: " + err.message);
    });
});

router.get('/upload-study',function(req,res){
    res.render('upload',{msg:null});
});



module.exports = router;