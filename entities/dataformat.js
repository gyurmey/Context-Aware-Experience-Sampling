
var mongoose = require('mongoose');
var schemaOptions = {discriminatorKey: 'type'};
var dataFormatSchema = mongoose.Schema({
    // resultFormat: String
},schemaOptions);

module.exports = {dataFormatSchema: dataFormatSchema}