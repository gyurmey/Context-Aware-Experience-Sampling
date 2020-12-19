
var mongoose = require('mongoose');
var schemaOptions = {discriminatorKey: 'type'};
var consentResultSchema = mongoose.Schema({

},schemaOptions);

var ConsentResult = mongoose.model('consentresult',consentResultSchema,'consentresult');

var acceptedResult = mongoose.Schema({
    answer:String
});

var AcceptedResultHook = ConsentResult.discriminator("accepted",acceptedResult);

var nameResult = mongoose.Schema({
    answer:Boolean
});

var NameResultHook = ConsentResult.discriminator("name",nameResult);

var signatureResult = mongoose.Schema({
    signature: String,
    signatureDate: Date
});
var SignatureResultHook = ConsentResult.discriminator("signature",signatureResult);
// var consentDocResultStep = mongoose.Schema({
//     answer: Boolean
// });
// var ConsentDocResultStep = ConsentResult.discriminator("consent_doc",consentDocResultStep);
// var nameConsentResultStep = mongoose.Schema({
//     answer: String
// });
// var NameConsentResultStep = ConsentResult.discriminator("consent_name_step",nameConsentResultStep);
// var signatureConsentResultStep = mongoose.Schema({
//     signature: String,
//     signatureDate: Date
// });
// var SignatureConsentResultStep = ConsentResult.discriminator("signature_step",signatureConsentResultStep);
module.exports = {ConsentResultModel: ConsentResult, ConsentResultSchema: consentResultSchema};