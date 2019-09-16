var mongoose = require('mongoose');
var resultSchema = mongoose.Schema({
    identifier: String,
    answer: [String],
    startDate:Date,
    endDate:Date,
    questionType:String
});

var Result = mongoose.model("result",resultSchema,"result");
module.exports = {ResultModel: Result,ResultSchema: resultSchema};