
var mongoose = require('mongoose');

var textChoiceItemSchema = mongoose.Schema({
    text:String,
    value: String
});

module.exports = {TextChoiceItemSchema: textChoiceItemSchema}