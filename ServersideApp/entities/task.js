var mongoose = require('mongoose');
var stepSchema = require('./step').stepSchema;
var triggerSchema = require('./trigger').TriggerSchema;
var imageChoiceSchema = require('./imagechoice').ImageChoiceSchema;
var textChoiceItemSchema=  require('./textchoiceitem').TextChoiceItemSchema;
var taskSchema = mongoose.Schema({
    taskName:String,
    personalData:Boolean,
    trigger:String,
    steps: [stepSchema]
});

var Task = mongoose.model("task",taskSchema,"task");

module.exports = {TaskModel:Task,TaskSchema:taskSchema};