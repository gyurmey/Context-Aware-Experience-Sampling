
var mongoose = require('mongoose');

var consentSchema = mongoose.Schema({
    overview: String,
    dataGathering : String,
    privacy :String,
    dataUse: String,
    timeCommitment: String,
    studySurvey :String,
    studyTasks :String,
    withdrawing :String
});
var Consent = mongoose.model('consent',consentSchema,'consent');

module.exports= {ConsentModel: Consent, ConsentSchema: consentSchema};