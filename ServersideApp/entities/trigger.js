
var mongoose = require('mongoose');
var loopSchema = require('./loop').LoopSchema;
var constraintSchema = require('./constraint').ConstraintSchema;



var triggerSchema = mongoose.Schema({
     minTimeBetweenSurveys:Number,
     maxCountPerDay : Number,
     triggeredBy: String,
     triggerName:String,
     loop: loopSchema,
     constraints: [constraintSchema]
});

var Trigger = mongoose.model('trigger',triggerSchema,'trigger');
//Define hook for loop type
var loopDataObject = triggerSchema.path("loop");


var activityLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String
});

var ActivityLoopHook = loopDataObject.discriminator("Activity",activityLoop);

var locationLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String
});
var LocationLoopHook = loopDataObject.discriminator("Location",locationLoop);

var accelerometerLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
     promptOn : String,
     sensingIntervalSec: Number
});

var AccelerometerLoopHook = loopDataObject.discriminator("Accelerometer",accelerometerLoop);

var temperatureLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String,
     sensingIntervalSec: Number,
     thresholdHigh:Number,
     thresholdLow:Number
});
var TemperatureLoopHook = loopDataObject.discriminator("Temperature",temperatureLoop);

var phoneCallLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String,
});

var PhoneCallLoopHook = loopDataObject.discriminator("PhoneCall",phoneCallLoop);

var proximityLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String,
     sensingIntervalSec: Number,
     distanceThreshold: Number
});

var ProximityLoopHook = loopDataObject.discriminator("Proximity",proximityLoop);

// var heartrateLoop = mongoose.Schema({
//      sensorType:String,
//     sensorValue:String,
//     promptOn : String,
//      thresholdHigh:Number,
//      thresholdLow:Number
// });

// var HeartrateLoopHook = loopDataObject.discriminator("Heartrate",heartrateLoop);

var batteryLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String,
     sensingIntervalSec: Number
});

var BatteryLoopHook = loopDataObject.discriminator("Battery",batteryLoop);

var calendarLoop = mongoose.Schema({
     sensorType:String,
    sensorValue:String,
    promptOn : String,
     sensingIntervalSec:Number
});

var CalendarLoopHook = loopDataObject.discriminator("Calendar",calendarLoop);

var notificationLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     promptOn : String,
     sensorAttribute: String});

var NotificationLoopHook = loopDataObject.discriminator("Notification",notificationLoop);

var timeIntervalLoop = mongoose.Schema({
     intervalMinutes:Number
});

var TimeIntervalLoopHook = loopDataObject.discriminator("TimeInterval",timeIntervalLoop);

var timeRandomisedLoop = mongoose.Schema({
     intervalMinutes:Number,
     plusMinusMinutes: Number
     });

var TimeRandomisedLoopHook = loopDataObject.discriminator("TimeRandomised",timeRandomisedLoop);
var timeAtEndLoop = mongoose.Schema({});

var TimeAtEndLoopHook = loopDataObject.discriminator("TimeAtEnd",timeAtEndLoop);

var timeAtStartLoop = mongoose.Schema({});

var TimeAtStartLoopHook = loopDataObject.discriminator("TimeAtStart",timeAtStartLoop);

var timeAtDateLoop = mongoose.Schema({
     date:Date,
     required: Boolean
});

var TimeAtDateLoopHook = loopDataObject.discriminator("TimeAtDate",timeAtDateLoop);

var timeDialyLoop = mongoose.Schema({
     hour:Number,
     minute:Number,
     required:Boolean
});

var TimeDialyLoopHook = loopDataObject.discriminator("TimeDialy",timeAtDateLoop);

var humidityLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     thresholdLow:Number,
     thresholdHigh:Number,
     sensingIntervalSec:Number,
     promptOn:String
});

var HumidityLoopHook = loopDataObject.discriminator("Humidity",humidityLoop);

var microphoneLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     sensingIntervalSec:Number,
     promptOn:String
});

var MicrophoneLoopHook = loopDataObject.discriminator("Microphone",microphoneLoop);

var calendarEventLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     sensingIntervalSec:Number,
     promptOn:String
});

var CalendarEventLoopHook = loopDataObject.discriminator("CalendarEvent",calendarEventLoop);


var specialCalendarEventLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     sensingIntervalSec:Number,
     promptOn:String
});

var SpecialCalendarEventLoopHook = loopDataObject.discriminator("SpecialCalendarEvent",specialCalendarEventLoop);

var notificationAppLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     promptOn:String
});

var NotificationAppLoopHook = loopDataObject.discriminator("NotificationApp",notificationAppLoop);

var notificationCategoryLoop = mongoose.Schema({
     sensorType:String,
     sensorValue:String,
     promptOn:String
});

var NotificationCategoryLoopHook = loopDataObject.discriminator("NotificationCategory",notificationCategoryLoop);



//Define hook for constraint types

var constraintArray = triggerSchema.path("constraints");

var activityConstraint = mongoose.Schema({
     sensorType: String,
    sensorValue: String
});
var ActivityConstraintHook = constraintArray.discriminator("Activity",activityConstraint);

var locationConstraint = mongoose.Schema({
     sensorType: String,
    sensorValue: String
});

var LocationConstraintHook = constraintArray.discriminator("Location",locationConstraint);

var accelerometerConstraint = mongoose.Schema({
     sensorType: String,
    sensorValue: String,
    sensingIntervalSec: Number
});

var AccelerometerConstraintHook = constraintArray.discriminator("Accelerometer",accelerometerConstraint);

var temperatureConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec: Number,
     thresholdHigh:Number,
     thresholdLow:Number
     });
var TemperatureConstraintHook = constraintArray.discriminator("Temperature",temperatureConstraint);

var phoneCallConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String
});

var PhoneCallConstraintHook = constraintArray.discriminator("PhoneCall",phoneCallConstraint);

var proximityConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec: Number,
     distanceThreshold: Number
});

var ProximityConstraintHook = constraintArray.discriminator("Proximity",proximityConstraint);

var heartrateConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     thresholdLow:Number,
     thresholdHigh: Number
});

var HeartrateConstraintHook = constraintArray.discriminator("Heartrate",heartrateConstraint);

var batteryConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec: Number
});

var BatteryConstraintHook = constraintArray.discriminator("Battery",batteryConstraint);

var calendarConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec: Number
});

var CalendarConstraintHook = constraintArray.discriminator("Calendar",calendarConstraint);

var notificationConstraint = mongoose.Schema({
     sensorType:String,
     sensorAttribute:String,
     sensorValue: String
});

var NotificationConstraintHook=  constraintArray.discriminator("Notification",notificationConstraint);

var locationTimeConstraint = mongoose.Schema({
     timeFrom: Number,
     timeTo: Number
});

var LocationTimeConstraintHook = constraintArray.discriminator("LocationTime",locationTimeConstraint);


var humidityConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     thresholdLow:Number,
     thresholdHigh:Number,
     sensingIntervalSec:Number
});

var HumidityConstraintHook = constraintArray.discriminator("Humidity",humidityConstraint);

var microphoneConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec:Number
});

var MicrophoneConstraintHook = constraintArray.discriminator("Microphone",microphoneConstraint);



var calendarEventConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec:Number
});

var CalendarEventConstraintHook = constraintArray.discriminator("CalendarEvent",calendarEventConstraint);


var specialCalendarConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String,
     sensingIntervalSec:Number
});

var SpecialCalendarConstraintHook = constraintArray.discriminator("SpecialCalendar",specialCalendarConstraint);

var notificationAppConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String
});

var NotificationAppConstraintHook = constraintArray.discriminator("NotificationApp",notificationAppConstraint);

var notificationCategoryConstraint = mongoose.Schema({
     sensorType: String,
     sensorValue: String
});

var NotificationCategoryConstraintHook = constraintArray.discriminator("NotificationCategory",notificationCategoryConstraint);

module.exports = {TriggerModel: Trigger,TriggerSchema : triggerSchema};