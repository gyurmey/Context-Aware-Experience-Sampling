var mongoose = require('mongoose');
var constraintSchema =  require('./constraint').ConstraintSchema;

var schemaOptions = {discriminatorKey: 'type'};
var loopSchema = mongoose.Schema({
},schemaOptions);

module.exports = {LoopSchema : loopSchema};