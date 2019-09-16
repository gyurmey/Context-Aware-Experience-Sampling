
var mongoose = require('mongoose');


var imageChoiceSchema = mongoose.Schema({
    file:String,
    value: String
});

//var ImageChoice = mongoose.model("imagechoice",imageChoiceSchema,"imagechoice");

module.exports = {ImageChoiceSchema : imageChoiceSchema}