var mongoose = require('mongoose');
var onDayTypeSchema = require('./onDayType').OnDayTypeSchema;

var schemaOptions = {discriminatorKey: 'type'};
var constraintSchema = mongoose.Schema({
    
},schemaOptions);

var Constraint  = mongoose.model('constraint',constraintSchema,'constraint');


module.exports = {ConstraintModel:Constraint,ConstraintSchema:constraintSchema};