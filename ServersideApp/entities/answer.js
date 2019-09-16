var mongoose = require('mongoose');
var resultSchema = require('./result').ResultSchema;
var userSchema = require('./user').UserSchema;
var sensorDataSchema = require('./sensordata').SensorDataSchema;

var answerSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    studyId: {type: mongoose.Schema.Types.ObjectId, ref: 'study'},
    answerDate: Date,
    startDate:Date,
    taskId:String,
    sensors: [sensorDataSchema],
    results : [resultSchema]
});

var Answer= mongoose.model("answer",answerSchema,"answer");



module.exports = {AnswerModel: Answer,AnswerSchema: answerSchema};