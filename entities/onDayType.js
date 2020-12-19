var mongoose = require('mongoose');

var onDayTypeSchema = mongoose.Schema({
    type:String
});

var OnDayType = mongoose.model("ondaytype",onDayTypeSchema,"ondaytype");

module.exports = {OnDayTypeModel : OnDayType,OnDayTypeSchema:onDayTypeSchema};