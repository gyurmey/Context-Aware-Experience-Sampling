var mongoose = require('mongoose');
var imageChoiceSchema = require('./imagechoice').ImageChoiceSchema;
var textChoiceItemSchema=  require('./textchoiceitem').TextChoiceItemSchema;
var stepItemSchema = require('./stepitem').stepItemSchema;
var stepSchema = mongoose.Schema({
    stepName:String,
    stepItems: [stepItemSchema]
  });


var Step = mongoose.model("step",stepSchema,"step");
module.exports = {stepSchema: stepSchema, StepModel: Step};