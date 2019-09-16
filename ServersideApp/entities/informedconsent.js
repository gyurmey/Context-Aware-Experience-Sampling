var mongoose = require('mongoose');
var schemaOptions = {discriminatorKey: 'type'};
var consentSectionSchema = mongoose.Schema({
    value:String
},schemaOptions);

var InformedConsent = mongoose.model("consentsection",consentSectionSchema,"consentsection");

module.exports = {consentSectionSchema: consentSectionSchema}