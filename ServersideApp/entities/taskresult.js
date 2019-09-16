var mongoose = require('mongoose');
var stepResultSchema = require('./stepresult').StepResultSchema;
var stepResultType = require('../constants/stepresulttype').StepResultType;
var uuidv4 = require('uuid/v4');
var stringStream = require('string-to-stream');
var taskResultSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    studyId: {type: mongoose.Schema.Types.ObjectId, ref: 'study'},
    taskId:String,
    taskName: String,
    startDate: Date,
    endDate:Date,
    stepResults: [stepResultSchema]
});


/**
 * Load media files from database for a task result
 * @param {Array} stepResults List of step results
 * @returns {Promise} list of promises 
 */
function loadFile(stepResults){
    
    var listPromises = new Array();
    stepResults.forEach(function(stepResult){
        stepResult.stepItemResults.forEach(function(item){
            switch(item.type){
                case stepResultType.IMAGE_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var objId = new mongoose.Types.ObjectId(item.image);
                        var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                        var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                        gridFSReadStream
                            .on('error', function (err) {
                                reject(err);
                            }).on('data', function (data) {
                                var part = data.toString('utf8');
                                item.image = part;
                                resolve("image read");
                            });
                    }));
                    break;
                }
                case stepResultType.AUDIO_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var objId = new mongoose.Types.ObjectId(item.audio);
                        var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                        var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                        gridFSReadStream
                            .on('error', function (err) {
                                reject(err);
                            }).on('data', function (data) {
                                var part = data.toString('utf8');
                                item.audio = part;
                                resolve("image read");
                            });
                    }));
                    break;
                }
                case stepResultType.VIDEO_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var objId = new mongoose.Types.ObjectId(item.video);
                        var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
                        var gridFSReadStream = gridFSBucket.openDownloadStream(objId);
                        gridFSReadStream
                            .on('error', function (err) {
                                reject(err);
                            }).on('data', function (data) {
                                var part = data.toString('utf8');
                                item.video = part;
                                resolve("image read");
                            });
                    }));
                    break;
                }
            }
        });
    });

    return Promise.all(listPromises);
}
/**
 * Load media files from database for a task results list
 * @param {Array} listTaskResults List of task results
 * @returns {Promise} list of promises 
 */
function loadFileForResults(listTaskResults){
    var listPromises = new Array();
    listTaskResults.forEach(function(item){
        listPromises.push(new Promise(function(resolve,reject){
            loadFile(item.stepResults)
            .then(rs=>{
                resolve("File loaded");
            })
            .catch(err=>{
                reject(err);
            });
        }));
    });
    return Promise.all(listPromises);
}
/**
 * Get all results of a study
 * @param {String} studyId the id of the study
 * @returns {Promise} Promise object
 */
taskResultSchema.statics.getResultByStudyId = function(studyId){
    var objId = new mongoose.Types.ObjectId(studyId);
    return new Promise(function(resolve,reject){
        TaskResult.find({studyId: objId},{__v:0, type:0})
        .then(rs=>{
            if(rs){
                var tobeLoaded = JSON.parse(JSON.stringify(rs));
                loadFileForResults(tobeLoaded)
                .then(rs=>{
                    resolve(tobeLoaded);
                })
                .catch(err=>{
                    reject(err);
                });
            }
        })
        .catch(err=>{
            reject(err.message);
        });

    });
}

taskResultSchema.statics.getResultByStudyIdAndName = function(studyId,taskName){
        var objId = new mongoose.Types.ObjectId(studyId);
        return new Promise(function(resolve,reject){
            TaskResult.find({studyId: objId,taskName:taskName},{__v:0, type:0})
            .then(rs=>{
                if(rs){
                    var tobeLoaded = JSON.parse(JSON.stringify(rs));
                    loadFileForResults(tobeLoaded)
                    .then(rs=>{
                        resolve(tobeLoaded);
                    })
                    .catch(err=>{
                        reject(err);
                    });
                }
            })
            .catch(err=>{
                reject(err.message);
            });
    
        });
    }

/**
 * Save media files to database
 * @param {Array} stepResults the id of the study
 * @returns {Promise} List of promises
 */

function saveResultFile(stepResults){
    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
    var listPromises = new Array();
    stepResults.forEach(function(stepResult){
        stepResult.stepItemResults.forEach(function(item){
            switch(item.type){
                case stepResultType.IMAGE_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(item.image).pipe(gridFSWriteStream);
                                gridFSWriteStream
                                .on('error', function (err) {
                                reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    item.image = gridFSWriteStream.id;
                                resolve("Image result saved");
                                });
                    }));
                    break;
                }
                case stepResultType.AUDIO_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(item.audio).pipe(gridFSWriteStream);
                                gridFSWriteStream
                                .on('error', function (err) {
                                reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    item.audio = gridFSWriteStream.id;
                                resolve("Image result saved");
                                });
                    }));
                    break;
                }
                case stepResultType.VIDEO_RESULT:{
                    listPromises.push(new Promise(function(resolve,reject){
                        var fileName = uuidv4();
                                var gridFSWriteStream = gridFSBucket.openUploadStream(fileName);
                                stringStream(item.video).pipe(gridFSWriteStream);
                                gridFSWriteStream
                                .on('error', function (err) {
                                reject("Error when save  image: " + err.message);
                                })
                                .on('finish', function () {
                                    item.video = gridFSWriteStream.id;
                                resolve("Image result saved");
                                });
                    }));
                    break;
                }
            }
        });
    });
    
    return Promise.all(listPromises);
}

/**
 * Save a task result to database
 * @param {TaskResut} taskResult the task result object
 * @returns {Promise} Promise object
 */
taskResultSchema.statics.insertResult = function(taskResult){
    return new Promise(function(resolve,reject){
        saveResultFile(taskResult.stepResults)
        .then(rs=>{
            TaskResult.create(taskResult)
            .then(rs=>{
                resolve("Result submitted");
            })
            .catch(err=>{
                reject(err.message);
            });
        })
        .catch(err =>{
            reject(err);
        });
    });
    
}

var TaskResult = mongoose.model("taskresult",taskResultSchema,"taskresult");

module.exports = {TaskResultModel: TaskResult, TaskResultSchema: taskResultSchema}