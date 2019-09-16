

var express = require('express');
var router = express.Router();
var passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
var RecaptchaBuilder = require('express-recaptcha').RecaptchaV2;

var recaptcha = new RecaptchaBuilder('6Lf81qgUAAAAALMdzOggytLswmqcYNF8sjkNnQ-V','6Lf81qgUAAAAAJ7pXqBLKVtRpRIll_UZtIOT5d7h',{callback: 'cb'});
router.get('/register',forwardAuthenticated, function (req, res){
	res.render('register');
});

router.get('/login',function (req, res) {
    res.render('login');
});

//Models
const Researcher = require('../entities/researcher').ResearcherModel;

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];


    //Check requireed fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all the fields' });
    }

    //Check Password match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check Password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    //Error Check
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        Researcher.register({name,
            email,
            password})
            .then(Researcher => {
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                );
                res.redirect('/login');
            })
            .catch(err => {
                req.flash(
                    'error_msg',
                    err
                );
                res.redirect('/login');
                //res.status(500).send(err);
            });
        // }
    }
    // }
});

router.post('/login',(req, res, next) => {
    // if (req.recaptcha.error) {
    //     res.redirect('/login');
    // }
    passport.authenticate('local', {
        session:true,
        successRedirect: '/editor',
        failureRedirect: '/login',
        failureFlash: 'Could not logged in. Check email and password'
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


module.exports = router;