var mongoose = require('mongoose');
var schemaOptions = {discriminatorKey: 'type'};
var stepItemResultSchema = mongoose.Schema({

},schemaOptions);

module.exports = {StepItemResultSchema: stepItemResultSchema}