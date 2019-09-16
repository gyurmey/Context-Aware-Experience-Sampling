
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Load User model
const Researcher = require('../entities/researcher').ResearcherModel;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email', session: true,passReqToCallback : true }, (req,email, password, done) => {
      // Match user
      Researcher.findOne({
        email: email
      }).then(researcher => {
        if (!researcher) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        Researcher.verifyLogin(email,password).then(researcher =>{
          return done(null, researcher);
        })
        .catch(err =>{ console.log(err);
        return done(null, false, { message: 'Password incorrect' })});
      });
    })
  );

  passport.serializeUser(function(researcher, done) {
    done(null, researcher.id);
  });

  passport.deserializeUser(function(id, done) {
    Researcher.findById(id, function(err, researcher) {
      done(err, researcher);
    });
  });
};
