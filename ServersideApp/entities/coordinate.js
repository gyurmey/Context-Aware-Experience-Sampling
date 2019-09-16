var mongoose = require('mongoose');

var coordinateSchema = mongoose.Schema({
    Latitude: String,
    Longitude: String
});

module.exports = {CoordinateSchema: coordinateSchema}