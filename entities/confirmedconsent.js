var mongoose = require('mongoose');
var consentResultSchema = require('./consentresult').ConsentResultSchema;
var confirmedConsentSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    studyId: {type: mongoose.Schema.Types.ObjectId, ref: 'study'},
    consentResults: [consentResultSchema]
});
var ConfirmedConsent = mongoose.model('confirmedconsent',confirmedConsentSchema,'confirmedconsent');

var consentResultArrays = confirmedConsentSchema.path('consentResults');
var acceptedResult = mongoose.Schema({
    answer:Boolean
});

var AcceptedResultHook = consentResultArrays.discriminator("accepted",acceptedResult);

var nameResult = mongoose.Schema({
    answer:String
});

var NameResultHook = consentResultArrays.discriminator("name",nameResult);

var signatureResult = mongoose.Schema({
    signature: String,
    signatureDate: Date
});
var SignatureResultHook = consentResultArrays.discriminator("signature",signatureResult);
module.exports = ConfirmedConsent;