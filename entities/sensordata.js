var mongoose = require('mongoose');

var sensorDataSchema = mongoose.Schema({
    sensorName: String,
    value : String
});

var SensorData = mongoose.model('sensordata',sensorDataSchema,'sensordata');

module.exports= {SensorDataModel: SensorData,SensorDataSchema : sensorDataSchema};

