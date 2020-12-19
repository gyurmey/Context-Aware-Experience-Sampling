
var mongoose = require('mongoose');

var scaleItemSchema = mongoose.Schema({
    label:String,
    value:String
});

module.exports = {ScaleItemSchema: scaleItemSchema}