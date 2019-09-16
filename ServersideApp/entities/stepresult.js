var mongoose = require('mongoose');
var stepItemResultSchema = require('./stepitemresult').StepItemResultSchema;
var coordinateSchema = require('./coordinate').CoordinateSchema;
var stepResultSchema = mongoose.Schema({
    stepId: String,
    stepName: String,
    stepItemResults: [stepItemResultSchema]
});
var StepResult = mongoose.model("stepresult",stepItemResultSchema,"stepresult");

var resultArray = stepResultSchema.path('stepItemResults');

var stringResultSchema = mongoose.Schema({
    variableName:String,
    value: String,
    startDate:Date,
    endDate: Date,
    origin: String
});
var StringResultHook = resultArray.discriminator('StringResult',stringResultSchema);

var stringArrayResultSchema = mongoose.Schema({
    variableName:String,
    value: [String],
    startDate:Date,
    endDate: Date,
    origin: String
});
var StringArrayResultHook = resultArray.discriminator('StringArrayResult',stringArrayResultSchema);

var imageResultSchema = mongoose.Schema({
    variableName:String,
    startDate:Date,
    endDate: Date,
    origin: String,
    image:String
});

var ImageResultHook = resultArray.discriminator("ImageResult",imageResultSchema);

var videoResultSchema = mongoose.Schema({
    variableName:String,
    startDate:Date,
    endDate: Date,
    origin: String,
    video:String
});

var VideoResultHook = resultArray.discriminator("VideoResult",videoResultSchema);

var audioResultSchema = mongoose.Schema({
    variableName:String,
    startDate:Date,
    endDate: Date,
    origin: String,
    audio:String
});

var AudioResultHook = resultArray.discriminator("AudioResult",audioResultSchema);

var locationResultSchema = mongoose.Schema({
    startDate:Date,
    origin: String,
    label: String,
    coordinate: [coordinateSchema]
});

var LocationResultHook = resultArray.discriminator("LocationResult",locationResultSchema);


//Adding four new result formats
var dateResultSchema = mongoose.Schema({
    variableName:String,
    value: String,
    startDate:Date,
    endDate: Date,
    origin: String
});
var DateResultHook = resultArray.discriminator('DateResult',dateResultSchema);

var scaleResultSchema = mongoose.Schema({
    variableName:String,
    value: Number,
    startDate:Date,
    endDate: Date,
    origin: String
});
var ScaleResultHook = resultArray.discriminator('ScaleResult',scaleResultSchema);


var scaleArrayResultSchema = mongoose.Schema({
    variableName:String,
    value: [Number],
    startDate:Date,
    endDate: Date,
    origin: String
});
var ScaleArrayResultHook = resultArray.discriminator('ScaleArrayResult',scaleArrayResultSchema);


var ordinalResultSchema = mongoose.Schema({
    variableName:String,
    value: Number,
    startDate:Date,
    endDate: Date,
    origin: String
});
var OrdinalResultHook = resultArray.discriminator('OrdinalResult',ordinalResultSchema);


var ordinalArrayResultSchema = mongoose.Schema({
    variableName:String,
    value: [Number],
    startDate:Date,
    endDate: Date,
    origin: String
});
var OrdinalArrayResultHook = resultArray.discriminator('OrdinalArrayResult',ordinalArrayResultSchema);



var nominalResultSchema = mongoose.Schema({
    variableName:String,
    value: String,
    startDate:Date,
    endDate: Date,
    origin: String
});
var NominalResultHook = resultArray.discriminator('NominalResult',nominalResultSchema);


var nominalArrayResultSchema = mongoose.Schema({
    variableName:String,
    value: [String],
    startDate:Date,
    endDate: Date,
    origin: String
});
var NominalArrayResultHook = resultArray.discriminator('NominalArrayResult',nominalArrayResultSchema);

module.exports = {StepResultSchema: stepResultSchema}