var mongoose = require('mongoose');
var md5 = require('md5');
var researcherSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

researcherSchema.statics.register = function(researcherObject){
    return new Promise(function(resolve,reject){
        Researcher.findOne({email: researcherObject.email })
        .then(rs=>{
            if(rs){
                reject("The email has been already registered");
            }else{
            var encryptedPw = md5(researcherObject.password);
            researcherObject.password = encryptedPw;
            Researcher.create(researcherObject)
            .then(rs=>{
                resolve("Account has been created");
                })
            .catch(err=>{
                reject("Error when creating account: " + err.messsage);
                });
            }
        })
        .catch(err=>{
            reject("Error: " + err.message);
        });
    });
    
    // var encryptedPw = md5(researcherObject.password);
    // researcherObject.password = encryptedPw;
    // return Researcher.create(researcherObject);
}
researcherSchema.statics.verifyLogin = function(email, pw){
    return Researcher.findOne({email: email, password: md5(pw)});
}

var Researcher = mongoose.model("researcher",researcherSchema,"researcher");
module.exports = {ResearcherModel:Researcher,ResearcherSchema:researcherSchema};

