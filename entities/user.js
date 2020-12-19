var mongoose = require('mongoose');

//NOTE: This is the document structure of Android user, not the user of the BACKEND
var userSchema = mongoose.Schema({
    token: String
});

var User = mongoose.model("user",userSchema,"user");
module.exports = {UserModel: User, UserSchema:userSchema};