
var mongoose = require('mongoose');
var dataFormatSchema = require('./dataformat').dataFormatSchema;
var imageChoiceSchema = require('./imagechoice').ImageChoiceSchema;
var textChoiceSchema = require('./textchoiceitem').TextChoiceItemSchema;
var scaleItemSchema  = require('./scaleitem').ScaleItemSchema;

var stepItemSchema = mongoose.Schema({
    variableName:String,
    variableLabel:String,
    optional:Boolean,
    confidential:Boolean,
    dataFormat: dataFormatSchema
});
var StepItem = mongoose.model("stepitem",stepItemSchema,"stepitem");
//var schemaOptions = {discriminatorKey: 'type', _id: false};
var dataFormatObject = stepItemSchema.path("dataFormat");

var instructionFormat = mongoose.Schema({
    title:String,
    text:String,
    detailText:String,
    image:String,
    origin:String
});
var InstructionFormatHook = dataFormatObject.discriminator("Instruction",instructionFormat);

var imageFormat = mongoose.Schema({
    title:String,
    text:String,
    templateImage:String,
    origin:String,
    resultFormat: String
});
var ImageFormatHook = dataFormatObject.discriminator("Image",imageFormat);

var videoFormat = mongoose.Schema({
    title:String,
    text:String,
    Image:String,
    origin:String,
    resultFormat: String
});
var VideoFormatHook = dataFormatObject.discriminator("Video",videoFormat);

var audioFormat = mongoose.Schema({
    title:String,
    text:String,
    duration:Number,
    origin:String,
    resultFormat: String
});

var AudioFormatHook = dataFormatObject.discriminator("Audio",audioFormat);

var dateFormat = mongoose.Schema({
    title:String,
    text:String,
    style:String,
    defaultdate:String,
    minimumdate:String,
    maximumdate:String,
    origin:String,
    resultFormat: String
});

var DateFormatHook = dataFormatObject.discriminator("Date",dateFormat);

var emailFormat = mongoose.Schema({
    title:String,
    text:String,
    origin:String,
    resultFormat: String
});

var EmailFormatHook = dataFormatObject.discriminator("Email",emailFormat);

var numericFormat = mongoose.Schema({
    title:String,
    text:String,
    style:String,
    minimum:String,
    maximum:String,
    scale:Number,
    origin:String,
    resultFormat: String
});

var NumericFormatHook = dataFormatObject.discriminator("Numeric",numericFormat);

var locationFormat = mongoose.Schema({
    title:String,
    text:String,
    useCurrentLocation: Boolean,
    origin:String,
    resultFormat: String
});

var LocationFormatHook = dataFormatObject.discriminator("Location",locationFormat);

var textFormat = mongoose.Schema({
    title:String,
    text:String,
    maximumLength:Number,
    multipleLines:Boolean,
    origin:String,
    resultFormat: String
});

var TextFormatHook = dataFormatObject.discriminator("Text",textFormat);

var discreteScaleFormat = mongoose.Schema({
    title:String,
    text:String,
    origin: String,
    maximum:Number,
    minimum:Number,
    step:Number,
    defaultValue:Number,
    vertical:Boolean,
    scaleItems: [scaleItemSchema],
    resultFormat: String
});
var DiscreteScaleHook = dataFormatObject.discriminator("DiscreteScale",discreteScaleFormat);

var continuousScaleFormat = mongoose.Schema({
    title:String,
    text:String,
    origin: String,
    maximum:Number,
    minimum:Number,
    defaultValue:Number,
    vertical:Boolean,
    scaleItems: [scaleItemSchema],
    resultFormat: String
});
var ContinuousScaleHook = dataFormatObject.discriminator("ContinuousScale",continuousScaleFormat);

var timeOfDayFormat = mongoose.Schema({
    title:String,
    text:String,
    defaultTime:String,
    origin:String,
    resultFormat: String
});
var TimeOfDayFormatHook = dataFormatObject.discriminator("TimeOfDay",timeOfDayFormat);

var imageChoiceFormat = mongoose.Schema({
    title:String,
    text:String,
    imageChoices: [imageChoiceSchema],
    origin:String,
    resultFormat: String
});
var ImageChoiceFormatHook = dataFormatObject.discriminator("ImageChoice",imageChoiceFormat);

var textChoiceFormat = mongoose.Schema({
    title:String,
    text:String,
    step:String,
    origin:String,
    textChoices: [textChoiceSchema],
    resultFormat: String
});

var TextChoiceFormatHook = dataFormatObject.discriminator("TextChoice",textChoiceFormat);


var activityFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var ActivityFormatHook = dataFormatObject.discriminator("Activity",activityFormat);

var lightFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var LightFormatHook = dataFormatObject.discriminator("Light",lightFormat);

var screenFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var ScreenFormatHook = dataFormatObject.discriminator("Screen",screenFormat);

var accelerometerFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var AccelerometerFormatHook = dataFormatObject.discriminator("Accelerometer",accelerometerFormat);

var temperatureFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var TemperatureFormatHook = dataFormatObject.discriminator("Temperature",temperatureFormat);

var phoneCallFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var PhoneCallFormatHook = dataFormatObject.discriminator("PhoneCall",phoneCallFormat);

var proximityFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var ProximityFormatHook = dataFormatObject.discriminator("Proximity",proximityFormat);

// var heartrateFormat = mongoose.Schema({
//     origin:String,
//     possibleValues:[String]
// });

// var HeartrateFormatHook = dataFormatObject.discriminator("Heartrate",heartrateFormat);

var batteryFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var BatteryFormatHook = dataFormatObject.discriminator("Battery",batteryFormat);

var calendarFormat = mongoose.Schema({
    origin:String,
    possibleValues:[String],
    resultFormat: String
});

var CalendarFormatHook = dataFormatObject.discriminator("Calendar",calendarFormat);

var notificationFormat = mongoose.Schema({
    origin:String,
    resultFormat: String
    
});

var NotificationFormatHook = dataFormatObject.discriminator("Notification",notificationFormat);

var humidityFormat = mongoose.Schema({
    origin:String,
    resultFormat: String
});

var HumidityFormatHook = dataFormatObject.discriminator("Humidity",humidityFormat);

var microphoneFormat = mongoose.Schema({
    origin: String,
    resultFormat: String
});

var MicrophoneFormatHook = dataFormatObject.discriminator("Microphone",microphoneFormat);

module.exports = {stepItemSchema: stepItemSchema}