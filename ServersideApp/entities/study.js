var mongoose = require('mongoose');
var taskSchema = require('./task').TaskSchema;
var triggerSchema = require('./trigger').TriggerSchema;
var answerSchema = require('./answer').AnswerSchema;
var uuidv4 = require('uuid/v4');
var stringStream = require('string-to-stream');
var moment = require('moment');
var Researcher = require('./researcher').ResearcherModel;
var consentSchema = require('./consent').ConsentSchema;
var DtoFactory = require('../dto/dtofactory');
var consentSectionSchema = require('./informedconsent').consentSectionSchema;
var StepItemType = require('../constants/steptype').StepItemType;
//Define study schema
var studySchema = mongoose.Schema({
    name: String,
    description: String,
    userSetsStartDate: Boolean,
    userSetsTimeRestriction:Boolean,
    defaultFromHour: Number,
    defaultToHour: Number,
    notifValidSec: Number,
    promptingWithInterval:Boolean,
    promptingIntervalSec: Number,
    repeatingAPrompt:Boolean,
    repeatDelaySeconds:Number,
    enableInformedConsent: Boolean,
    tasks: [taskSchema],
    triggers: [triggerSchema],
    informedConsent: [consentSectionSchema],
    isPublic: Boolean,
    isConfirmed: Boolean,
    researcher: { type: mongoose.Schema.Types.ObjectId, ref: 'researcher' },
    participantResearchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'researcher'}],
    minimumStudyDurationPerPerson:Number,
    maximumStudyDurationPerPerson:Number,
    earliestBeginOfDataGathering:Date,
    latestBeginOfDataGathering: Date
});


//Creating hook for Consents
var consentArray = studySchema.path("informedConsent");

var overviewConsent = mongoose.Schema({});

var OverviewConsentHook = consentArray.discriminator("overview",overviewConsent);

var dataGatheringConsent = mongoose.Schema({});

var DataGatheringHook = consentArray.discriminator("dataGathering",dataGatheringConsent);

var privacyConsent = mongoose.Schema({});

var PrivacyHook = consentArray.discriminator("privacy",privacyConsent);

var dataUseConsent = mongoose.Schema({});

var DataUseHook = consentArray.discriminator("dataUse",dataUseConsent);

var timeCommitmentConsent = mongoose.Schema({});

var TimeCommitmentHook = consentArray.discriminator("timeCommitment",timeCommitmentConsent);

var studySurveyConsent = mongoose.Schema({});

var TimeSurveyHook = consentArray.discriminator("studySurvey",studySurveyConsent);

var studyTasksConsent = mongoose.Schema({});

var StudyTasksHook = consentArray.discriminator("studyTasks",studyTasksConsent);

var withdrawingConsent = mongoose.Schema({});

var WithdrawingHook = consentArray.discriminator("withdrawing",withdrawingConsent);


//Save large files (image, audio, video) to GridFS Bucket via MongoDB driver

/**
 * Save media files of a study to database
 * @param {Study} toBeInsertedObj The study object
 * @returns {Promise} list of promises 
 */
function saveFile(toBeInsertedObj) {
    console.log("Called save file");
    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
    var listPromises = new Array();
    toBeInsertedObj.tasks.forEach(function(task){
        task.steps.forEach(function(step){
            step.stepItems.forEach(function(stepItem){
                switch(stepItem.dataFormat.type){
                    case StepItemType.INSTRUCTION:{
                        listPromises.push(new Promise(function(resolve,reject){
                            if(!stepItem.dataFormat.image)
                            {
                                console.log("Break instruction");
                                resolve("No data to save");
                                
                            } else
                            {
                                var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(stepItem.dataFormat.image).pipe(gridFSWriteStream);
    
                                gridFSWriteStream
                                .on('error', function (err) {
                                reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    stepItem.dataFormat.image = gridFSWriteStream.id;
                                resolve("Icon saved");
                                });
                            }
                            
                            }));
                        break;
                    }
                    case StepItemType.IMAGE:{
                        listPromises.push(new Promise(function(resolve,reject){
                            if(!stepItem.dataFormat.templateImage)
                            {
                                resolve("No data to save");
                            }
                            else{
                                var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(stepItem.dataFormat.templateImage).pipe(gridFSWriteStream);
                                gridFSWriteStream
                                .on('error', function (err) {
                                    reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    stepItem.dataFormat.templateImage = gridFSWriteStream.id;
                                resolve("Icon saved");
                                });
                            }
                            
                            }));
                        break;
                    }
                    case StepItemType.VIDEO:{
                        listPromises.push(new Promise(function(resolve,reject){
                            if(!stepItem.dataFormat.Image)
                            {
                                resolve("No data to save");
                                
                            }else{
                                var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(stepItem.dataFormat.Image).pipe(gridFSWriteStream);
                                gridFSWriteStream
                                .on('error', function (err) {
                                reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    stepItem.dataFormat.Image = gridFSWriteStream.id;
                                resolve("Icon saved");
                                });
                            }
                            
                            }));
                        break;
                    }
                    case StepItemType.IMAGE_CHOICE:{
                        stepItem.dataFormat.imageChoices.forEach(function(choice){
                            listPromises.push(new Promise(function(resolve,reject){
                                if(!choice.file){
                                    resolve("No image to be saved");
                                }
                                else{
                                    var fileName = uuidv4();
                                    var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                    var str = require("string-to-stream");
                                    str(choice.file).pipe(gridFSWriteStream);
                                    gridFSWriteStream
                                    .on('error', function (err) {
                                    reject("Error when save  image: " + err.message);
                                    })
                                    .on('finish', function () {
                                        choice.file = gridFSWriteStream.id;
                                    resolve("Icon saved");
                                    });
                                }
                          
                            
                            
                               
                            
                                
                                }));
                        });
                        break;
                    }
                }
                
            });
        });
    });

    return Promise.all(listPromises);
}

//Create a new study which includes images in question steps
//NOTE: The media file must be encoded base64 string 
/**
 * Insert a study to database
 * @param {Study} studyobject The study object to be inserted
 * @returns {Promise} list of promises 
 */
studySchema.statics.createstudy = function (studyobject) {
    console.log("Create");
    return new Promise(function (resolve, reject) {
        var toBeInsertedObj = JSON.parse(JSON.stringify(studyobject));
        //console.log(toBeInsertedObj);
        //console.log(studyobject.triggers[0]);
        saveFile(toBeInsertedObj)
            .then(rs => {
                Study.create(toBeInsertedObj)
                    .then(rs => {
                        console.log("Study has been saved");
                        resolve("Study has been saved");
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};
/**
 * Delete a study
 * @param {String} id The id of the study to be deleted
 * @returns {Promise} promise object 
 */
studySchema.statics.deleteStudy = function (id) {
    console.log("Deleting");
    return new Promise(function (resolve, reject) {
        Study.findById(id)
            .then(study => {
                if (!study) {
                    reject("Could not find the study by this id");
                    return;
                }
                console.log("Deleting");
                var tobeDeleted = JSON.parse(JSON.stringify(study));
                //console.log(studyObject.identifier);

                //Delete related file of the target study
                Study.findByIdAndDelete(id)
                            .then(rs => {
                                console.log("Done delete study");
                                deleteFileFromStudy(tobeDeleted)
                                .then(rs => {
                                        console.log("Done delete files");
                                        resolve("Study has been deleted");
                                    })
                                    .catch(err => {
                                            //reject(err);
                                            resolve("Study has been deleted");
                                    });
                                    //resolve("Study has been deleted");
                            })
                            .catch(err => {
                                reject(err);
                            });
                
            })
    });
}

//Loading files of a study
/**
 * Load media files from database for a study
 * @param {Study} study The study object to be loaded
 * @returns {Promise} list of promises 
 */
function loadFile(study) {
    //console.log("Called load file");
    
    var listPromises = new Array();

    study.tasks.forEach(function(task){
        task.steps.forEach(function(step){
            step.stepItems.forEach(function(stepItem){
                switch(stepItem.dataFormat.type){
                    case StepItemType.INSTRUCTION:{
                        listPromises.push(new Promise(function(resolve,reject){
                            //var objId=null;
                     try{
                        if(!stepItem.dataFormat.image){
                            stepItem.dataFormat.image = "";
                            resolve("No image to be loaded");
                        }
                        else{
                            var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.image);
                                console.log("Load Instruction image " + stepItem.dataFormat.image);
                                var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                                 gridFSReadStream
                                    .on('error', function (err) {
                                        console.log("erreRead instruction " + err);
                                        //reject(err);
                                        stepItem.dataFormat.image = "";
                                        resolve("No image to be loaded");
                                    }).on('data', function (data) {
                                    var part = data.toString('utf8');
                                    console.log("Read instruction");
                                    stepItem.dataFormat.image = part;
                                    resolve("image read");
                        }).on('finish', function () {
                            console.log("finishRead instruction");
                            resolve("image read");
                            });
                        }
                        
                     } catch(err){
                        stepItem.dataFormat.image = "";
                        resolve("image read");
                     }
                                

                            }));
                        break;
                    }
                    case StepItemType.IMAGE:{
                        listPromises.push(new Promise(function(resolve,reject){
                            try{
                                if(!stepItem.dataFormat.templateImage){
                                    stepItem.dataFormat.templateImage ="";
                                    resolve("No image to be read");
                                }
                                else{
                                    var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.templateImage);
                                    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                    var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                                    console.log("Load IMAGE image " + stepItem.dataFormat.templateImage);
                                    gridFSReadStream
                                        .on('error', function (err) {
                                                //reject(err);
                                                console.log("Error reading image code line 331" + err);
                                                stepItem.dataFormat.templateImage ="";
                                                resolve("No image to be loaded");
                                            }).on('data', function (data) {
                                            var part = data.toString('utf8');
                                            stepItem.dataFormat.templateImage = part;
                                            resolve("Icon read");
                                            });
                                }
                                
                                } catch(err){
                                        stepItem.dataFormat.templateImage ="";
                                        resolve("image read");
                                }
                        }));
                        
                        break;
                    }
                    case StepItemType.VIDEO:{
                        listPromises.push(new Promise(function(resolve,reject){
                            try
                            {
                                if(!stepItem.dataFormat.Image){
                                    stepItem.dataFormat.Image = "";
                                    resolve("No image to be loaded");
                                }
                                else {
                                    var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.Image);
                                    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                    console.log("Load IMAGE image " + stepItem.dataFormat.Image);
                            var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                            gridFSReadStream
                                .on('error', function (err) {
                                    console.log("Error when reading template image line 356" + err);
                                    stepItem.dataFormat.Image = "";
                                    resolve("No image to be loaded");
                                    //reject(err);
                                }).on('data', function (data) {
                                    var part = data.toString('utf8');
                                    stepItem.dataFormat.Image = part;
                                    resolve("Icon read");
                                });
                                }
                                
                            } catch(err){
                                stepItem.dataFormat.Image="";
                                resolve("image read");
                            }
                            
                        }));
                        
                        break;
                    }
                    case StepItemType.IMAGE_CHOICE:{
                        stepItem.dataFormat.imageChoices.forEach(function(choice){
                            listPromises.push(new Promise(function(resolve,reject){
                                try{
                                    if(!choice.file){
                                        choice.file = "";
                                        resolve("No image choice to be loaded");
                                    } else{
                                        var objId = new mongoose.Types.ObjectId(choice.file);
                                        var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                        var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                                    gridFSReadStream
                            .on('error', function (err) {
                                console.log("Error when reading image choice line 382 " + err);
                                choice.file = "";
                                resolve("No image to be loaded");
                                //reject(err);
                            }).on('data', function (data) {
                                var part = data.toString('utf8');
                                choice.file = part;
                                resolve("Icon read");
                            });
                                    }
                                    
                                } catch(err){
                                    choice.file = "";
                                    resolve("image read");
                                }
                                }));
                        });
                        break;
                    }
                }
            
            });
        });
    });
    
    return Promise.all(listPromises);
}

//Find a study by id
/**
 * Find a study by id
 * @param {String} id The id of the study
 * @returns {StudyDto} The DTO study object
 */
studySchema.statics.findStudyById = function (id) {
    return new Promise(function (resolve, reject) {
        Study.findById(id)
            .then(study => {
                var toBeLoaded = JSON.parse(JSON.stringify(study));
                loadFile(toBeLoaded)
                    .then(rs => {
                        var studyDto = DtoFactory.toStudyDetailDto(toBeLoaded._id,
                            toBeLoaded.name,
                            toBeLoaded.description,
                            toBeLoaded.userSetsStartDate,
                            toBeLoaded.userSetsTimeRestriction,
                            toBeLoaded.earliestBeginOfDataGathering,
                            toBeLoaded.latestBeginOfDataGathering,
                            toBeLoaded.minimumStudyDurationPerPerson,
                            toBeLoaded.maximumStudyDurationPerPerson,
                            toBeLoaded.defaultFromHour,
                            toBeLoaded.defaultToHour,
                            toBeLoaded.notifValidSec,
                            toBeLoaded.promptingWithInterval,
                            toBeLoaded.promptingIntervalSec,
                            toBeLoaded.repeatingAPrompt,
                            toBeLoaded.repeatDelaySeconds,
                            toBeLoaded.enableInformedConsent,
                            toBeLoaded.tasks,
                            toBeLoaded.triggers,
                            toBeLoaded.informedConsent)
                        resolve(studyDto);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}



//Delete all file of a study
/**
 * Delete media files of a study
 * @param {Study} study The study object to be deleted
 * @returns {Promise} List of promises
 */
function deleteFileFromStudy(study) {
    console.log("Delete called");
    var listPromises = new Array();
    study.tasks.forEach(function(task){
        task.steps.forEach(function(step){
            step.stepItems.forEach(function(stepItem){
                switch(stepItem.dataFormat.type){
                    case StepItemType.INSTRUCTION:{
                        listPromises.push(new Promise(function(resolve,reject){
                            try{
                                var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.image);
                                console.log("Delete file INSTRUCTION " + stepItem.dataFormat.image);
                                gridFSBucket.delete(objId, function (err) {
                                    if (err) {
                                        //reject(err.message);
                                        console.log("Error when deleting file line 476 " + err);
                                    }
                                    resolve("image deleted");
            
                                });
                            } catch(err){
                                resolve("No file to be deleted");
                            }
                            
                            }));
                        break;
                    }
                    case StepItemType.IMAGE:{
                        listPromises.push(new Promise(function(resolve,reject){
                            try{
                                var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.templateImage);
                                console.log("Delete file IMAGE " + stepItem.dataFormat.templateImage);
                                gridFSBucket.delete(objId, function (err) {
                                    if (err) {
                                        console.log("Error when deleting image line 496 " + err);
                                        //reject(err.message);
                                    }
                                    resolve("image deleted");
            
                                });
                            } catch(err){
                                resolve("No file was deleted");
                            }
                            
                        }));
                        
                        break;
                    }
                    case StepItemType.VIDEO:{
                        listPromises.push(new Promise(function(resolve,reject){
                            try{
                                var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                var objId = new mongoose.Types.ObjectId(stepItem.dataFormat.Image);
                                console.log("Delete file VIDEO " + stepItem.dataFormat.Image);
                                gridFSBucket.delete(objId, function (err) {
                                    if (err) {
                                        console.log("Error when deleting template image line 518 " + err);
                                        //reject(err.message);
                                    }
                                    resolve("video deleted");
            
                                });
                            } catch(err){
                                resolve("No file to be deleted");
                            }
                            
                        }));
                        
                        break;
                    }
                    case StepItemType.IMAGE_CHOICE:{
                        stepItem.dataFormat.imageChoices.forEach(function(choice){
                            listPromises.push(new Promise(function(resolve,reject){
                                try{
                                    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                                    var objId = new mongoose.Types.ObjectId(choice.file);
                                    console.log("Delete file Image CHOICE " + choice.file);
                                    gridFSBucket.delete(objId, function (err) {
                                        if (err) {
                                            console.log("Error when deleting image choice line 541" + err);
                                            //reject(err.message);
                                        }
                                        resolve("video deleted");
                
                                    });
                                } catch(err){
                                    resolve("No file to be deleted");
                                }
                                
                                }));
                        });
                        break;
                    }
                }
            });
        });
    });
    return Promise.all(listPromises);
}


//Update a study by id
/**
 * Delete media files of a study
 * @param {Study} study The study object to be deleted
 * @returns {Promise} List of promises
 */
studySchema.statics.updateStudy = function (id, studyObject) {
    return new Promise(function (resolve, reject) {
        Study.findById(id)
            .then(study => {
                if (!study) {
                    reject("Could not find the study by this id");
                }
                if (study.isConfirmed) {
                    reject("The study has been already confirmed and it cannot be modified.");
                    return;
                }
                //Clone new study object in order to detach from database context
                var tobeUpdated = JSON.parse(JSON.stringify(study));
                //Remove old files
                deleteFileFromStudy(tobeUpdated)
                    .then(rs => {
                        tobeUpdated.name = studyObject.name;
                        tobeUpdated.description = studyObject.description;

                        tobeUpdated.earliestBeginOfDataGathering = studyObject.earliestBeginOfDataGathering;
                        tobeUpdated.latestBeginOfDataGathering = studyObject.latestBeginOfDataGathering;
                        if(studyObject.InformedConsent){
                            tobeUpdated.InformedConsent = studyObject.InformedConsent;
                        }
                        if (studyObject.isConfirmed)
                            tobeUpdated.isConfirmed = studyObject.isConfirmed;
                        if (studyObject.isPublic)
                            tobeUpdated.isPublic = studyObject.isPublic;
                        if (studyObject.triggers)
                            tobeUpdated.triggers = JSON.parse(JSON.stringify(studyObject.triggers));
                        if (studyObject.tasks)
                            tobeUpdated.tasks = JSON.parse(JSON.stringify(studyObject.tasks));
                        if (studyObject.participantResearchers)
                            tobeUpdated.participantResearchers = JSON.parse(JSON.stringify(studyObject.participantResearchers));
                        //Merging back
                        saveFile(tobeUpdated)
                            .then(result => {
                                Study.updateOne({_id:tobeUpdated._id},tobeUpdated)
                                    .then(data => {
                                        console.log("Updated");
                                        resolve("Study has been updated");
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            })
                            .catch(err => {
                                reject(err);
                            });

                    })
                    .catch(err => {
                        reject(err);
                    });
            })
    });
}

//Update a study state to confirm
/**
 * Update a study state to confirm
 * @param {String} id The id of the study
 * @returns {Promise} Promise object
 */
studySchema.statics.confirmStudy = function (id) {
    return new Promise(function (resolve, reject) {
        Study.findById(id)
            .then(study => {
                if (!study) {
                    reject("Could not found the study by given id");
                }
                var tobeConfirmed = JSON.parse(JSON.stringify(study));
                if (moment(tobeConfirmed.startDate).isBefore(Date.now())) {
                    reject("Could not confirmed because the startdate is before current date");
                }
                tobeConfirmed.isConfirmed = true;
                Study.updateOne({_id: id},{$set:{isConfirmed: tobeConfirmed.isConfirmed}})
                    .then(rs => {
                        resolve("Study has been confirmed");
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}


/**
 * Get list of participant researchers
 * @param {String} id The id of the study
 * @returns {Promise} Promise object
 */
studySchema.statics.getParticipants = function (studyId) {
    return new Promise(function (resolve, reject) {
        Study.findById(studyId).populate('participantResearchers')
            .then(study => {
                if (study) {
                    if (study) {
                        var listEmails = new Array();
                        if (study.participantResearchers) {
                            study.participantResearchers.forEach(function (item) {
                                listEmails.push(item.email);
                            });
                        }
                        resolve(listEmails);
                    } else {
                        resolve(new Array());
                    }
                }
            })
            .catch(err => {
                reject(err.message);
            });
    });
}
/**
 * Check whether participants exist in the system or not
 * @param {Array} listParticipants list of current participants
 * @param {Array} listTobeAdded list of participants to be updated
 * @returns {Promise} List of promises
 */
function checkParticipants(listParticipants, listTobeAdded) {
    var listPromises = new Array();
    listParticipants.forEach(function (item) {
        listPromises.push(new Promise(function(resolve,reject){
            Researcher.findOne({ email: item })
            .then(rs => {
                if (rs) {
                    var objId = new mongoose.Types.ObjectId(rs._id);
                    listTobeAdded.push(objId);
                    resolve("Email approved");
                } else {
                    reject("Email does not exist in the system: " + item);
                }
            })
            .catch(err => {
                reject("Error when adding participants");
            });
        }));
    });
    return Promise.all(listPromises);

}
/**
 * Add list of participant researchers to a study
 * @param {String} id the id of the study
 * @param {Array} listParticipants list of current participants
 * @returns {Promise} List of promises
 */
studySchema.statics.addParticipants = function (id, listParticipants) {
    return new Promise(function (resolve, reject) {
        Study.findById(id)
            .then(study => {
                if (study) {
                    var listTobeAdded = new Array();
                    checkParticipants(listParticipants,listTobeAdded)
                        .then(rs => {
                            // //detach to mongoose
                            var tobeUpdated = JSON.parse(JSON.stringify(study));
                            if (listTobeAdded.length > 0) {
                                tobeUpdated.participantResearchers = listTobeAdded;
                            } else {
                                tobeUpdated.participantResearchers = null;
                            }
                            Study.updateOne({_id:tobeUpdated._id},{$set:{participantResearchers: tobeUpdated.participantResearchers}})
                                .then(rs => {
                                    resolve("Participants added");
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            console.log("reject " + err);
                            reject(err);
                        });


                } else {
                    reject("Could not find study");
                }
            })
            .catch(err => {
                reject(err.message);
            });
    });
}


//Get list of all studies by researcherId
/**
 * Check whether participants exist in the system or not
 * @param {Array} listStudies List raw study objects
 * @param {Array} listDtos list study dtos
 * @returns {Promise} List of promises
 */
function parseToDto(listStudies,listDtos){
    var listPromises = new Array();
    listStudies.forEach(function(item){
        listPromises.push(new Promise(function(resolve,reject){
            var studydto = DtoFactory.toStudyDetailDto(item._id,
                item.name,
                item.description,
                item.userSetsStartDate,
                item.userSetsTimeRestriction,
                item.earliestBeginOfDataGathering,
                item.latestBeginOfDataGathering,
                item.minimumStudyDurationPerPerson,
                item.maximumStudyDurationPerPerson,
                item.defaultFromHour,
                item.defaultToHour,
                item.notifValidSec,
                item.promptingWithInterval,
                item.promptingIntervalSec,
                item.repeatingAPrompt,
                item.repeatDelaySeconds,
                item.enableInformedConsent,
                item.tasks,
                item.triggers,
                item.informedConsent);
            listDtos.push(studydto);
            resolve("parsed");
        }
        ));
    });
    return Promise.all(listPromises);
}
/**
 * Load media files to dto object
 * @param {Array} listDtos list study dtos
 * @returns {Promise} List of promises
 */
function loadFilesForDtos(studyDtos){
    var listPromises = new Array();
    studyDtos.forEach(function(dto){
        listPromises.push(new Promise(function(resolve,reject){
            loadFile(dto)
            .then(rs=>{
                resolve("File loaded");
            })
            .catch(err=>{
                reject("Error when loading file");
            });
        }));
    });
    return Promise.all(listPromises);
}
/**
 * Get list of studies of a researcher
 * @param {String} researcherId the id of the researcher
 * @returns {Promise} promise object
 */
studySchema.statics.getStudiesByResearcherId = function(researcherId){
    return new Promise(function (resolve, reject) {
        var objId = new mongoose.Types.ObjectId(researcherId);
        Study.find({ $or:[ {'researcher':objId}, {'participantResearchers':objId}]})
            .then(studies => {
                if(!studies || studies.length == 0){
                    reject("No study could be found");
                }
                else{
                    var listDtos = new Array();
                    var tobeParsed = JSON.parse(JSON.stringify(studies));
                    parseToDto(tobeParsed,listDtos)
                    .then(rs=>{
                        loadFilesForDtos(listDtos)
                        .then(rs=>{
                            //console.log(JSON.stringify(listDtos));
                            resolve(listDtos);
                        })
                        .catch(rs=>{
                            reject("Error when loading data")
                        });
                    })
                    .catch(err=>{
                        reject("Error when retrieving data");
                    });
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}


var Study = mongoose.model("study", studySchema, "study");
module.exports = Study;
